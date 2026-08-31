const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getFfmpegPath: () => ipcRenderer.invoke('fcp:get-ffmpeg-path'),
	getGpuInfo: () => ipcRenderer.invoke('fcp:get-gpu-info'),
	cancelConversion: () => ipcRenderer.invoke('fcp:cancel-conversion'),
	convertMedia: (fileData, fileName, targetFormat, targetDimensions) =>
		ipcRenderer.invoke('fcp:convert-media', fileData, fileName, targetFormat, targetDimensions),
		getFilePath: (file) => webUtils.getPathForFile(file),
	transcribeAudio: (fileData, fileName, targetFormat) => ipcRenderer.invoke('fcp:transcribe-audio', fileData, fileName, targetFormat),
	onTranscriptionProgress: (callback) => {
		const listener = (_event, progress) => callback(progress);
		ipcRenderer.on('fcp:transcription-progress', listener);
		return () => ipcRenderer.removeListener('fcp:transcription-progress', listener);
	},
	readFile: (filePath) => ipcRenderer.invoke('fcp:read-file', filePath),
	writeFile: (filePath, data) => ipcRenderer.invoke('fcp:write-file', filePath, data),
	saveFile: (options) => ipcRenderer.invoke('fcp:save-file', options),
	getWallpaper: () => ipcRenderer.invoke('fcp:get-wallpaper'),
	chooseWallpaper: () => ipcRenderer.invoke('fcp:choose-wallpaper'),
	disableWallpaper: () => ipcRenderer.invoke('fcp:disable-wallpaper'),
});
