// app/main.js
const { app, BrowserWindow, Menu } = require('electron');
const path  = require('path');
const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, 'frontend', 'dist', 'index.html')
    );
  }
}

/* ---------- Menu template ---------- */
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New Project', click: () => mainWindow.webContents.send('menu:new') },
      { label: 'Open Project', click: () => mainWindow.webContents.send('menu:open') },
      { label: 'Save Project', click: () => mainWindow.webContents.send('menu:save') },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [ { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
               { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
               { role: 'selectAll' } ]
  },
  {
    label: 'View',
    submenu: [ { role: 'reload' }, { role: 'toggleDevTools' },
               { type: 'separator' }, { role: 'resetZoom' },
               { role: 'zoomIn' }, { role: 'zoomOut' },
               { type: 'separator' }, { role: 'togglefullscreen' } ]
  },
  {
    label: 'Run',
    submenu: [
      { label: 'Run Model',  click: () => mainWindow.webContents.send('menu:run') },
      { label: 'Stop Model', click: () => mainWindow.webContents.send('menu:stop') }
    ]
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/wae010/hybrid-qml-ide-Repository');
        } }
    ]
  }
];
/* ---------- /Menu template ---------- */

app.whenReady().then(() => {
  createWindow();
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
