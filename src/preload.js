const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    pickFolder: () => ipcRenderer.invoke('pick-folder'),
    scanGames: (steamappsPath) => ipcRenderer.invoke('scan-games', steamappsPath),
    playGame: (appId) => ipcRenderer.send('play-game', appId),
    minimize: () => ipcRenderer.send('window-minimize'),
    close: () => ipcRenderer.send('window-close')
});