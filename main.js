const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const { fork } = require('child_process');
const fs = require('fs-extra');

let mainWindow;
let serverProcess;
let serverPort = 3001; // Default

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'EduTech Pro Suite',
    icon: path.join(__dirname, 'public/pwa-512x512.png'),
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#020617', // Match React background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev 
    ? 'http://localhost:5174' 
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure the database exists in the persistent data path
async function ensureDbInitialized() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'dev.db');
    
    // In production, SQLite files must be in a writable location
    if (!fs.existsSync(dbPath)) {
        console.log('Initializing persistent database at:', dbPath);
        
        // Try to copy from the distribution bundle if it exists
        const bundledDbPath = path.join(__dirname, 'server/prisma/dev.db');
        if (fs.existsSync(bundledDbPath)) {
            try {
                await fs.copy(bundledDbPath, dbPath);
                console.log('Template database copied to persistent storage.');
            } catch (err) {
                console.error('Failed to copy bundled database:', err);
            }
        } else {
            console.log('No bundled template found. System will expect fresh initialization.');
        }
    }
}

// Start local Express server in a separate process
async function startServer() {
  await ensureDbInitialized();
  const userDataPath = app.getPath('userData');
  
  serverProcess = fork(path.join(__dirname, 'server/index.js'), [], {
    env: { 
        ...process.env, 
        NODE_ENV: isDev ? 'development' : 'production',
        DATA_PATH: userDataPath
    }
  });

  serverProcess.on('message', (msg) => {
    console.log('Server process message:', msg);
    if (msg.type === 'server-ready') {
        serverPort = msg.port;
        if (mainWindow) {
            mainWindow.webContents.send('server-port', serverPort);
        }
    }
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server process:', err);
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

// IPC communication
ipcMain.handle('get-env', () => {
    return {
        isDev,
        version: app.getVersion(),
        serverPort
    }
})

ipcMain.on('exit-app', () => {
    app.quit();
});
