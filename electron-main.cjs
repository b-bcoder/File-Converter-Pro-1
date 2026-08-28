const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('node:fs/promises');
const { randomUUID } = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const ffmpegPath = require('ffmpeg-static');

const isDevelopment = !app.isPackaged;
const developmentUrl = 'http://localhost:3000';
const iconPath = path.join(__dirname, 'assets', 'icon.ico');
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

ipcMain.handle('fcp:get-ffmpeg-path', () => ffmpegPath);
ipcMain.handle('fcp:get-gpu-info', () => gpuInfo);
ipcMain.handle('fcp:convert-media', async (_event, fileData, fileName, targetFormat, targetDimensions) => {
  const workDir = path.join(app.getPath('temp'), 'fcp', randomUUID());
  const extension = path.extname(fileName) || '.bin';
  const inputPath = path.join(workDir, `input${extension}`);
  const outputPath = path.join(workDir, `output.${String(targetFormat).toLowerCase()}`);

  await fs.mkdir(workDir, { recursive: true });
  await fs.writeFile(inputPath, Buffer.from(fileData));

  try {
    const args = ['-y', '-i', inputPath];
    const isVideoOutput = ['MP4', 'WEBM', 'WMV', 'MKV'].includes(String(targetFormat).toUpperCase());
    if (gpuInfo.hasDedicatedGpu && isVideoOutput) {
      args.unshift('-hwaccel', 'auto');
    }
    if (gpuInfo.encoder && ['MP4', 'MKV'].includes(String(targetFormat).toUpperCase())) {
      args.push('-c:v', gpuInfo.encoder);
    }
    if (targetDimensions) {
      args.push('-vf', `scale=w=${targetDimensions.width}:h=${targetDimensions.height}:force_original_aspect_ratio=decrease,pad=${targetDimensions.width}:${targetDimensions.height}:-1:-1:color=black`);
    }
    args.push(outputPath);

    await new Promise((resolve, reject) => {
      const process = spawn(nativeFfmpegPath, args, { windowsHide: true });
      let errorOutput = '';
      process.stderr.on('data', data => { errorOutput += data.toString(); });
      process.on('error', reject);
      process.on('close', code => code === 0 ? resolve() : reject(new Error(errorOutput.trim() || `FFmpeg exited with code ${code}`)));
    });

    return await fs.readFile(outputPath);
  } finally {
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
    /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla|Radeon RX|Radeon Pro|Arc|Intel\(R\) Arc/i.test(name)
  );
  const encoder = dedicated && /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla/i.test(dedicated)
    ? 'h264_nvenc'
    : dedicated && /AMD|Radeon/i.test(dedicated)
      ? 'h264_amf'
      : null;

  return {
    hasDedicatedGpu: Boolean(dedicated),
    vendor: dedicated && /NVIDIA|GeForce|RTX|GTX|Quadro|Tesla/i.test(dedicated) ? 'nvidia' : dedicated ? 'amd-or-intel' : 'integrated',
    name: dedicated || gpuNames[0] || 'unknown',
    encoder
  };
}