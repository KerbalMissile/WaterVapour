const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const https = require('https');

const currentVersion = app.getVersion();
const GITHUB_USER = 'KerbalMissile';
const GITHUB_REPO = 'WaterVapour';

function checkForUpdates() {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/latest`,
        headers: { 'User-Agent': 'WaterVapour' }
    };

    https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const release = JSON.parse(data);
                const latest = release.tag_name.replace('v', '');

                if (latest !== currentVersion) {
                    dialog.showMessageBox(mainWindow, {
                        type: 'info',
                        title: 'Update Available',
                        message: `WaterVapour ${latest} is available!`,
                        detail: `You are on version ${currentVersion}. Would you like to download the update?`,
                        buttons: ['Download', 'Later'],
                        defaultId: 0
                    }).then(result => {
                        if (result.response === 0) {
                            shell.openExternal(release.html_url);
                        }
                    });
                }
            } catch (e) {}
        });
    }).on('error', () => {});
}

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

    mainWindow.webContents.once('did-finish-load', () => {
        checkForUpdates();
    });
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