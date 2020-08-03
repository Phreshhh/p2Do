const electron = require('electron');
const {autoUpdater} = require("electron-updater");
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const windowStateKeeper = require('electron-window-state');

let mainWindow;

function createWindow () {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 440,
    defaultHeight: 660
  });

  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    title: 'p2Do',
    icon: __dirname + '/build/icons/favicon.ico'
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });

  if ( process.argv[1] !== '.') {
    autoUpdater.checkForUpdates();
  }

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on('update-downloaded', (ev, info) => {
  autoUpdater.quitAndInstall();
});
