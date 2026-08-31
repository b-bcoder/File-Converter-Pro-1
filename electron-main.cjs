const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('node:fs/promises');
const { randomUUID } = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const ffmpegPath = require('ffmpeg-static');

const isDevelopment = !app.isPackaged;
const developmentUrl = 'http://localhost:3000';
const iconPath = path.join(__dirname, 'assets', 'icon.ico');
const whisperRootPath = path.join(__dirname, 'node_modules', 'whisper-node', 'lib', 'whisper.cpp').replace('app.asar', 'app.asar.unpacked');
const whisperExecutablePath = path.join(whisperRootPath, process.platform === 'win32' ? 'main.exe' : 'main');
const whisperModelPath = path.join(whisperRootPath, 'models', 'ggml-base.en.bin');
const whisperRuntimePath = 'C:\\msys64\\mingw64\\bin';
const gpuInfo = detectGpu();
const nativeFfmpegPath = app.isPackaged
  ? ffmpegPath.replace('app.asar', 'app.asar.unpacked')
  : ffmpegPath;

if (process.platform === 'win32') {
  app.setAppUserModelId('com.fcp.fileconverter');
}

if (!gpuInfo.hasDedicatedGpu) {
  app.disableHardwareAcceleration();
}

Menu.setApplicationMenu(null);

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    icon: iconPath,
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.webContents.on('before-input-event', (_event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      window.setFullScreen(!window.isFullScreen());
    }
  });

  if (isDevelopment) {
    loadDevelopmentPage(window);
  } else {
    window.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

const wallpaperConfigPath = path.join(app.getPath('userData'), 'config.json');
let activeConversionProcess = null;

async function readWallpaperConfig() {
  try {
    const config = JSON.parse(await fs.readFile(wallpaperConfigPath, 'utf8'));
    const wallpaper = config?.Configurations?.Wallpaper;
    if (wallpaper?.Wallpaper_on_off !== 'On' || !wallpaper.Wallpaperpath) return { enabled: false, path: null, dataUrl: null };
    const imageData = await fs.readFile(wallpaper.Wallpaperpath);
    const extension = path.extname(wallpaper.Wallpaperpath).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
    return { enabled: true, path: wallpaper.Wallpaperpath, dataUrl: `data:${mimeType};base64,${imageData.toString('base64')}` };
  } catch {
    return { enabled: false, path: null, dataUrl: null };
  }
}

async function writeWallpaperConfig(enabled, wallpaperPath = '') {
  const config = { Configurations: { Wallpaper: {
    Wallpaperset: Boolean(wallpaperPath), Wallpaperpath: wallpaperPath,
    Wallpaper_on_off: enabled && wallpaperPath ? 'On' : 'Off'
  } } };
  await fs.mkdir(path.dirname(wallpaperConfigPath), { recursive: true });
  await fs.writeFile(wallpaperConfigPath, JSON.stringify(config, null, 2), 'utf8');
}

ipcMain.handle('fcp:get-ffmpeg-path', () => ffmpegPath);
ipcMain.handle('fcp:get-gpu-info', () => gpuInfo);
ipcMain.handle('fcp:cancel-conversion', async () => {
  if (activeConversionProcess && !activeConversionProcess.killed) {
    activeConversionProcess.kill('SIGKILL');
  }
  return true;
});
ipcMain.handle('fcp:get-wallpaper', () => readWallpaperConfig());
ipcMain.handle('fcp:transcribe-audio', async (event, fileData, fileName, targetFormat) => {
  const format = String(targetFormat || 'TXT').toUpperCase();
  const workDir = path.join(app.getPath('temp'), 'fcp-whisper', randomUUID());
  const extension = path.extname(fileName) || '.wav';
  const inputPath = path.join(workDir, `input${extension}`);
  const normalizedPath = path.join(workDir, 'input.wav');

  await fs.mkdir(workDir, { recursive: true });
  await fs.writeFile(inputPath, Buffer.from(fileData));

  try {
    const ffmpegArgs = ['-y', '-i', inputPath, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', normalizedPath];
    await new Promise((resolve, reject) => {
      const process = spawn(nativeFfmpegPath, ffmpegArgs, { windowsHide: true });
      activeConversionProcess = process;
      let stderr = '';
      process.stderr.on('data', data => { stderr += data.toString(); });
      process.on('error', reject);
      process.on('close', code => {
        activeConversionProcess = null;
        if (code === 0) resolve();
        else reject(new Error(stderr.trim() || `FFmpeg exited with code ${code}`));
      });
    });

    const whisperArgs = [
      '-m', whisperModelPath,
      '-f', normalizedPath,
      '-l', 'auto',
      '-pp',
      format === 'SRT' ? '-osrt' : '-otxt'
    ];
    const result = await new Promise((resolve, reject) => {
      const childProcess = spawn(whisperExecutablePath, whisperArgs, {
        cwd: whisperRootPath,
        windowsHide: true,
        env: {
          ...process.env,
          PATH: process.platform === 'win32'
            ? `${whisperRuntimePath};${process.env.PATH || ''}`
            : process.env.PATH
        }
      });
      activeConversionProcess = childProcess;
      let stdout = '';
      let stderr = '';
      const reportProgress = data => {
        const text = data.toString();
        const match = text.match(/(?:progress\s*[=:]?\s*|\s)(\d{1,3})%/i);
        if (match) {
          event.sender.send('fcp:transcription-progress', Number(match[1]));
        }
        stderr += text;
      };
      childProcess.stdout.on('data', data => {
        const text = data.toString();
        stdout += text;
        const match = text.match(/(?:progress\s*[=:]?\s*|\s)(\d{1,3})%/i);
        if (match) event.sender.send('fcp:transcription-progress', Number(match[1]));
      });
      childProcess.stderr.on('data', reportProgress);
      childProcess.on('error', reject);
      childProcess.on('close', code => {
        activeConversionProcess = null;
        if (code === 0) resolve(stdout);
        else reject(new Error(stderr.trim() || stdout.trim() || `Whisper exited with code ${code}`));
      });
    });

    const outputExtension = format === 'SRT' ? '.srt' : '.txt';
    const outputFile = (await fs.readdir(workDir)).find(name => name.toLowerCase().endsWith(outputExtension));

    if (outputFile) {
      return await fs.readFile(path.join(workDir, outputFile), 'utf8');
    }

    if (Array.isArray(result) && result.length > 0) {
      return result
        .map((item) => item.speech ?? '')
        .filter(Boolean)
        .join('\n');
    }

    throw new Error('Whisper finished without producing a transcript file.');
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
});
ipcMain.handle('fcp:choose-wallpaper', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }] });
  if (result.canceled || !result.filePaths[0]) return readWallpaperConfig();
  await writeWallpaperConfig(true, result.filePaths[0]);
  return readWallpaperConfig();
});
ipcMain.handle('fcp:disable-wallpaper', async () => {
  const current = await readWallpaperConfig();
  await writeWallpaperConfig(false, current.path || '');
  return { enabled: false, path: current.path, dataUrl: null };
});
ipcMain.handle('fcp:convert-media', async (_event, fileData, fileName, targetFormat, targetDimensions) => {
  const workDir = path.join(app.getPath('temp'), 'fcp', randomUUID());
  const extension = path.extname(fileName) || '.bin';
  const inputPath = typeof fileData === 'string' ? fileData : path.join(workDir, `input${extension}`);
  const outputPath = path.join(workDir, `output.${String(targetFormat).toLowerCase()}`);

  await fs.mkdir(workDir, { recursive: true });
  if (typeof fileData !== 'string') {
    await fs.writeFile(inputPath, Buffer.from(fileData));
  }

  try {
    const args = ['-y', '-i', inputPath];
    const targetFormatUpper = String(targetFormat).toUpperCase();
    const isVideoOutput = ['MP4', 'WEBM', 'WMV', 'MKV'].includes(targetFormatUpper);
    const isAudioOutput = ['MP3', 'WAV', 'FLAC', 'OGG'].includes(targetFormatUpper);
    const canUseGpuEncoder = gpuInfo.hasDedicatedGpu && isVideoOutput && ['MP4', 'MKV'].includes(targetFormatUpper) && gpuInfo.encoder;

    const buildArgs = (useGpu = true) => {
      const finalArgs = [...args];

      if (useGpu && canUseGpuEncoder) {
        finalArgs.push('-c:v', gpuInfo.encoder);
        finalArgs.push('-preset', gpuInfo.vendor === 'nvidia' ? 'p4' : 'medium');
        finalArgs.push('-pix_fmt', 'yuv420p');
        finalArgs.push('-movflags', '+faststart');
      }

      if (targetFormatUpper === 'HEIC') {
        finalArgs.push('-c:v', 'libx265', '-tag:v', 'hvc1', '-pix_fmt', 'yuv420p', '-f', 'mp4', '-brand', 'heic');
      }

      if (isAudioOutput) {
        finalArgs.push('-map', '0:a:0', '-vn', '-map_metadata', '-1', '-map_chapters', '-1');
      }

      if (targetDimensions && !isAudioOutput) {
        finalArgs.push('-vf', `scale=w=${targetDimensions.width}:h=${targetDimensions.height}:force_original_aspect_ratio=decrease,pad=${targetDimensions.width}:${targetDimensions.height}:-1:-1:color=black`);
      }
      finalArgs.push(outputPath);
      return finalArgs;
    };

    const runFfmpeg = async (ffmpegArgs, useGpu = true) => {
      await new Promise((resolve, reject) => {
        const process = spawn(nativeFfmpegPath, ffmpegArgs, { windowsHide: true });
        activeConversionProcess = process;
        let errorOutput = '';
        let lastOutputAt = Date.now();

        const timeoutId = setInterval(() => {
          if (Date.now() - lastOutputAt > 60000) {
            if (!process.killed) process.kill('SIGKILL');
            clearInterval(timeoutId);
            reject(new Error(useGpu ? 'Conversion stalled for over 60 seconds, switching to software encoding.' : 'Conversion stalled for over 60 seconds and was cancelled.'));
          }
        }, 2000);

        process.stderr.on('data', data => {
          errorOutput += data.toString();
          lastOutputAt = Date.now();
        });
        process.on('error', error => {
          clearInterval(timeoutId);
          reject(error);
        });
        process.on('close', code => {
          clearInterval(timeoutId);
          activeConversionProcess = null;
          if (code === 0) resolve();
          else reject(new Error(errorOutput.trim() || `FFmpeg exited with code ${code}`));
        });
      });
    };

    try {
      await runFfmpeg(buildArgs(true), true);
    } catch (error) {
      const message = String(error || '');
      if (canUseGpuEncoder && /stalled for over 60 seconds|SIGKILL|timed out/i.test(message)) {
        await runFfmpeg(buildArgs(false), false);
      } else {
        throw error;
      }
    }

    return await fs.readFile(outputPath);
  } finally {
    activeConversionProcess = null;
    await fs.rm(workDir, { recursive: true, force: true });
  }
});
ipcMain.handle('fcp:read-file', (_event, filePath) => fs.readFile(filePath));
ipcMain.handle('fcp:write-file', async (_event, filePath, data) => {
  await fs.writeFile(filePath, Buffer.from(data));
  return true;
});
ipcMain.handle('fcp:save-file', async (_event, options) => {
  const result = await dialog.showSaveDialog(options || {});
  return result.canceled ? null : result.filePath;
});

function loadDevelopmentPage(window, attempt = 0) {
  window.loadURL(developmentUrl).catch(() => {
    if (attempt < 50) {
      setTimeout(() => loadDevelopmentPage(window, attempt + 1), 200);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function detectGpu() {
  if (process.platform !== 'win32') {
    return { hasDedicatedGpu: true, vendor: 'unknown', name: 'system GPU', encoder: null };
  }

  const result = spawnSync('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-Command',
    "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name | ConvertTo-Json -Compress"
  ], { encoding: 'utf8', windowsHide: true, timeout: 5000 });
  const rawNames = result.status === 0 ? result.stdout.trim() : '';
  let names;
  try {
    names = rawNames ? JSON.parse(rawNames) : [];
  } catch {
    names = [];
  }
  if (!Array.isArray(names)) names = [names];

  const gpuNames = names.filter(Boolean).map(String);
  const dedicated = gpuNames.find(name =>
    /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla|Radeon RX|Radeon Pro|Arc|Intel.*Arc|Intel.*UHD|Intel.*Iris/i.test(name)
  );

  const encoder = dedicated && /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla/i.test(dedicated)
    ? 'h264_nvenc'
    : dedicated && /AMD|Radeon/i.test(dedicated)
      ? 'h264_amf'
      : dedicated && /Intel|Arc/i.test(dedicated)
        ? 'h264_qsv'
        : null;

  const vendor = dedicated && /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla/i.test(dedicated)
    ? 'nvidia'
    : dedicated && /AMD|Radeon/i.test(dedicated)
      ? 'amd'
      : dedicated && /Intel|Arc/i.test(dedicated)
        ? 'intel'
        : 'integrated';

  return {
    hasDedicatedGpu: Boolean(dedicated),
    vendor,
    name: dedicated || gpuNames[0] || 'unknown',
    encoder
  };
}