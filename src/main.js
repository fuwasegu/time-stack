const { app, BrowserWindow, ipcMain, Menu, Tray, Notification, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs');
const { exec } = require('child_process');
const { autoUpdater } = require('electron-updater');

// 自動更新の設定
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';
// 自動インストールを無効化（ユーザーに確認を求めるため）
autoUpdater.autoInstallOnAppQuit = false;

// macOSのネイティブ通知を表示する関数
function showMacOSNotification(title, body) {
  return new Promise((resolve, reject) => {
    // 特殊文字をエスケープ
    const escapedTitle = title.replace(/"/g, '\\"');
    const escapedBody = body.replace(/"/g, '\\"');
    
    const script = `display notification "${escapedBody}" with title "${escapedTitle}"`;
    
    exec(`osascript -e '${script}'`, (error) => {
      if (error) {
        console.error('macOS通知エラー:', error);
        reject(error);
      } else {
        console.log('macOS通知を表示しました');
        resolve();
      }
    });
  });
}

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

  // 自動更新の設定
  if (!isDev) {
    // 開発モードでない場合のみ自動更新を有効化
    autoUpdater.checkForUpdatesAndNotify();
    
    // 更新が利用可能になったときのイベント
    autoUpdater.on('update-available', (info) => {
      // レンダラープロセスに通知
      if (mainWindow) {
        mainWindow.webContents.send('update-available', info);
      }
      
      showMacOSNotification(
        'アップデートが利用可能です',
        `新しいバージョン ${info.version} がダウンロードされます`
      );
      
      // ログに記録
      autoUpdater.logger.info('更新が利用可能です:', info);
    });
    
    // 更新のダウンロードの進行状況
    autoUpdater.on('download-progress', (progressObj) => {
      // レンダラープロセスに進行状況を通知
      if (mainWindow) {
        mainWindow.webContents.send('download-progress', progressObj);
      }
      
      // ログに記録
      autoUpdater.logger.info('ダウンロード進行状況:', progressObj);
    });
    
    // 更新のダウンロードが完了したときのイベント
    autoUpdater.on('update-downloaded', (info) => {
      // レンダラープロセスに通知
      if (mainWindow) {
        mainWindow.webContents.send('update-downloaded', info);
      }
      
      // ダイアログを表示して更新を確認
      dialog.showMessageBox({
        type: 'info',
        title: 'アップデートの準備ができました',
        message: `新しいバージョン ${info.version} がインストールされます。`,
        detail: 'アプリを再起動して更新を適用しますか？',
        buttons: ['今すぐ再起動', '後で'],
        defaultId: 0
      }).then(({ response }) => {
        if (response === 0) {
          // 「今すぐ再起動」が選択された場合
          autoUpdater.quitAndInstall();
        }
      });
      
      showMacOSNotification(
        'アップデートの準備ができました',
        `新しいバージョン ${info.version} がインストールされます。アプリを再起動してください。`
      );
      
      // ログに記録
      autoUpdater.logger.info('更新のダウンロードが完了しました:', info);
    });
    
    // エラーが発生した場合のイベント
    autoUpdater.on('error', (err) => {
      // レンダラープロセスに通知
      if (mainWindow) {
        mainWindow.webContents.send('update-error', err);
      }
      
      console.error('自動更新エラー:', err);
      autoUpdater.logger.error('自動更新エラー:', err);
    });
    
    // 定期的に更新をチェック（1時間ごと）
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 60 * 1000);
  }

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

// UUID生成
ipcMain.handle('generate-uuid', async () => {
  // uuidパッケージがインストールされていれば使用
  try {
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
  } catch (error) {
    console.error('uuidパッケージの読み込みに失敗しました:', error);
    // フォールバック: 簡易的なUUID生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
});

// 通知の表示
ipcMain.handle('show-notification', async (event, { title, body }) => {
  console.log('通知リクエストを受信:', { title, body });
  
  if (!store.get('settings.notificationsEnabled')) {
    console.log('通知が無効になっています');
    return false;
  }
  
  try {
    // macOSの場合はネイティブ通知を使用
    if (process.platform === 'darwin') {
      console.log('macOSネイティブ通知を使用します');
      await showMacOSNotification(title, body);
      return true;
    }
    
    // その他のプラットフォームではElectron通知を使用
    console.log('Electron通知を作成します');
    const notification = new Notification({
      title,
      body,
      silent: false
    });
    
    console.log('通知を表示します');
    notification.show();
    console.log('通知を表示しました');
    return true;
  } catch (error) {
    console.error('通知の表示中にエラーが発生しました:', error);
    return false;
  }
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

// 手動で更新をチェックするためのIPC通信
ipcMain.handle('check-for-updates', async () => {
  if (isDev) {
    return { success: false, message: '開発モードでは更新チェックは無効です' };
  }
  
  try {
    autoUpdater.logger.info('手動更新チェックを開始します');
    await autoUpdater.checkForUpdates();
    return { success: true };
  } catch (error) {
    autoUpdater.logger.error('手動更新チェック中にエラーが発生しました:', error);
    return { success: false, message: error.message };
  }
});

// 更新をインストールするためのIPC通信
ipcMain.handle('install-update', async () => {
  if (isDev) {
    return { success: false, message: '開発モードでは更新インストールは無効です' };
  }
  
  try {
    autoUpdater.logger.info('更新のインストールを開始します');
    autoUpdater.quitAndInstall();
    return { success: true };
  } catch (error) {
    autoUpdater.logger.error('更新のインストール中にエラーが発生しました:', error);
    return { success: false, message: error.message };
  }
}); 