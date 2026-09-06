const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getFfmpegPath: () => ipcRenderer.invoke('fcp:get-ffmpeg-path'),
	getGpuInfo: () => ipcRenderer.invoke('fcp:get-gpu-info'),
	checkForUpdate: () => ipcRenderer.invoke('fcp:check-for-update'),
	downloadAndInstallUpdate: (update) => ipcRenderer.invoke('fcp:download-and-install-update', update),
	cancelConversion: () => ipcRenderer.invoke('fcp:cancel-conversion'),
	convertMedia: (fileData, fileName, targetFormat) =>
		ipcRenderer.invoke('fcp:convert-media', fileData, fileName, targetFormat),
		getFilePath: (file) => webUtils.getPathForFile(file),
	transcribeAudio: (fileData, fileName, targetFormat) => ipcRenderer.invoke('fcp:transcribe-audio', fileData, fileName, targetFormat),
	onTranscriptionProgress: (callback) => {
		const listener = (_event, progress) => callback(progress);
		ipcRenderer.on('fcp:transcription-progress', listener);
		return () => ipcRenderer.removeListener('fcp:transcription-progress', listener);
	},
	onMediaProgress: (callback) => {
		const listener = (_event, progress) => callback(progress);
		ipcRenderer.on('fcp:media-progress', listener);
		return () => ipcRenderer.removeListener('fcp:media-progress', listener);
	},
	readFile: (filePath) => ipcRenderer.invoke('fcp:read-file', filePath),
	writeFile: (filePath, data) => ipcRenderer.invoke('fcp:write-file', filePath, data),
	chooseOutputDirectory: () => ipcRenderer.invoke('fcp:choose-output-directory'),
	writeOutputFile: (filePath, data) => ipcRenderer.invoke('fcp:write-output-file', filePath, data),
	stageFile: (fileData, fileName) => ipcRenderer.invoke('fcp:stage-file', fileData, fileName),
	cleanupStagedFile: (filePath) => ipcRenderer.invoke('fcp:cleanup-staged-file', filePath),
	deleteSourceFile: (filePath) => ipcRenderer.invoke('fcp:delete-source-file', filePath),
	saveFile: (options) => ipcRenderer.invoke('fcp:save-file', options),
	getWallpaper: () => ipcRenderer.invoke('fcp:get-wallpaper'),
	chooseWallpaper: () => ipcRenderer.invoke('fcp:choose-wallpaper'),
	disableWallpaper: () => ipcRenderer.invoke('fcp:disable-wallpaper'),
});
