const { app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // enable remote debugging port so external Chrome can attach (useful for packaged exe)
  app.commandLine.appendSwitch('remote-debugging-port', '9222');

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_DEVTOOLS === 'true') {
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent navigation away from the app
  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  // Hide menu bar
  mainWindow.removeMenu();

  // Register a global shortcut to toggle DevTools (works even in packaged exe)
  // Ctrl/Cmd+Shift+I will toggle DevTools
  const shortcut = 'CommandOrControl+Shift+I';
  try {
    const registered = globalShortcut.register(shortcut, () => {
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.toggleDevTools();
      }
    });
    console.log('DevTools shortcut registered:', registered);
  } catch (err) {
    console.warn('Failed to register global shortcut for DevTools:', err);
  }
}

app.on('ready', createWindow);

// IPC handler for file dialogs (used by preload)
ipcMain.handle('dialog:openFile', async (event, options) => {
  const browserWindow = mainWindow || BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(browserWindow, options || {});
  return result.filePaths || [];
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Unregister global shortcuts on quit
app.on('will-quit', () => {
  try { globalShortcut.unregisterAll(); } catch (e) { /* ignore */ }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
