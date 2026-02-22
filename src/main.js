const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

if (process.platform === 'win32') {
    app.setAppUserModelId('com.watervapour.app');
}

let mainWindow;

function createWindow() {
    const iconPath = path.join(__dirname, '..', 'Assets', 'WaterVapourLogo.ico');

    mainWindow = new BrowserWindow({
        width: 450,
        height: 800,
        backgroundColor: '#111111',
        icon: iconPath,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    Menu.setApplicationMenu(null);
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
ipcMain.on('window-close', () => mainWindow && mainWindow.close());

ipcMain.handle('pick-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select your steamapps folder'
    });
    if (result.canceled) return null;
    return result.filePaths[0];
});

ipcMain.handle('scan-games', async (event, steamappsPath) => {
    if (!steamappsPath) return { error: 'No folder selected.' };
    if (!fs.existsSync(steamappsPath)) return { error: 'Folder does not exist.' };

    const entries = fs.readdirSync(steamappsPath);
    const manifests = entries.filter(f => f.startsWith('appmanifest_') && f.endsWith('.acf'));

    if (manifests.length === 0) {
        return { error: 'No appmanifest files found. Select the steamapps folder, not steamapps/common.' };
    }

    const games = [];

    for (const file of manifests) {
        const content = fs.readFileSync(path.join(steamappsPath, file), 'utf8');
        const name = content.match(/"name"\s+"([^"]+)"/);
        const appId = content.match(/"appid"\s+"([^"]+)"/);
        if (name && appId) {
            games.push({ name: name[1], id: appId[1] });
        }
    }

    return { games };
});

ipcMain.on('play-game', (event, appId) => {
    exec(`start steam://rungameid/${appId}`);
});