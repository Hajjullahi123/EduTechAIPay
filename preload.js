const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getEnv: () => ipcRenderer.invoke('get-env'),
  exitApp: () => ipcRenderer.send('exit-app'),
});
