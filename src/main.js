const { app, BrowserWindow, ipcMain, Menu, Tray, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs');

// データストアの初期化
const store = new Store({
  name: 'time-stack-data',
  defaults: {
    timers: [],
    settings: {
      notificationsEnabled: true
    }
  }
});

// アプリケーションのウィンドウとトレイを保持する変数
let mainWindow;
let tray = null;

// 開発モードかどうかを判定
const isDev = process.argv.includes('--dev');

function createWindow() {
  // ブラウザウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#2c2c2c',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // HTMLファイルをロード
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 開発モードの場合は開発者ツールを開く
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // ウィンドウが閉じられたときの処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // ウィンドウが最小化されたときの処理
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
  
  // ウィンドウのロード完了後にドラッグ可能領域を設定
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      const header = document.querySelector('.app-header');
      if (header) {
        header.style.webkitAppRegion = 'drag';
        
        // ボタンなどクリック可能な要素はドラッグ不可に設定
        const nonDraggableElements = header.querySelectorAll('button, .btn, input');
        nonDraggableElements.forEach(el => {
          el.style.webkitAppRegion = 'no-drag';
        });
      }
    `);
  });
}

// トレイアイコンを作成
function createTray() {
  try {
    // デフォルトのアイコンパス
    let iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
    
    // アイコンファイルが存在しない場合は、Electronのデフォルトアイコンを使用
    if (!fs.existsSync(iconPath)) {
      console.warn('トレイアイコンが見つかりません。デフォルトアイコンを使用します。');
      iconPath = path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.app', 'Contents', 'Resources', 'electron.icns');
      
      // それでも見つからない場合は、空の16x16の透明なPNGを作成
      if (!fs.existsSync(iconPath)) {
        console.warn('デフォルトアイコンも見つかりません。空のアイコンを使用します。');
        const { nativeImage } = require('electron');
        const emptyImage = nativeImage.createEmpty();
        tray = new Tray(emptyImage);
      } else {
        tray = new Tray(iconPath);
      }
    } else {
      tray = new Tray(iconPath);
    }
    
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: '表示', 
        click: () => {
          if (mainWindow === null) {
            createWindow();
          } else {
            mainWindow.show();
          }
        } 
      },
      { 
        label: '終了', 
        click: () => {
          app.quit();
        } 
      }
    ]);
    
    tray.setToolTip('Time Stack');
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
      if (mainWindow === null) {
        createWindow();
      } else {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    });
  } catch (error) {
    console.error('トレイアイコンの作成中にエラーが発生しました:', error);
  }
}

// Electronの初期化が完了したらウィンドウとトレイを作成
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// すべてのウィンドウが閉じられたときの処理
app.on('window-all-closed', function (e) {
  // macOSでは、ユーザーがCmd + Qで明示的に終了するまで
  // アプリケーションとそのメニューバーは有効なままにするのが一般的
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC通信の処理
// タイマーデータの取得
ipcMain.handle('get-timers', async () => {
  return store.get('timers');
});

// タイマーデータの保存
ipcMain.handle('save-timers', async (event, timers) => {
  store.set('timers', timers);
  return true;
});

// 通知の表示
ipcMain.handle('show-notification', async (event, { title, body }) => {
  if (!store.get('settings.notificationsEnabled')) return false;
  
  const notification = new Notification({
    title,
    body,
    silent: false
  });
  
  notification.show();
  return true;
});

// 設定の取得
ipcMain.handle('get-settings', async () => {
  return store.get('settings');
});

// 設定の保存
ipcMain.handle('save-settings', async (event, settings) => {
  store.set('settings', settings);
  return true;
}); 