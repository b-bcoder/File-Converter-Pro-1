const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getFfmpegPath: () => ipcRenderer.invoke('fcp:get-ffmpeg-path'),
	getGpuInfo: () => ipcRenderer.invoke('fcp:get-gpu-info'),
	convertMedia: (fileData, fileName, targetFormat, targetDimensions) =>
		ipcRenderer.invoke('fcp:convert-media', fileData, fileName, targetFormat, targetDimensions),
	readFile: (filePath) => ipcRenderer.invoke('fcp:read-file', filePath),
	writeFile: (filePath, data) => ipcRenderer.invoke('fcp:write-file', filePath, data),
	saveFile: (options) => ipcRenderer.invoke('fcp:save-file', options)
});
