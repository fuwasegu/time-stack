const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');
const { showMacOSNotification } = require('./native-notification');

// アプリケーションのウィンドウを保持する変数
let mainWindow;

function createWindow() {
  // ブラウザウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // HTMLファイルをロード
  mainWindow.loadFile('index.html');

  // 開発者ツールを開く（開発時のみ）
  mainWindow.webContents.openDevTools();

  // ウィンドウが閉じられたときの処理
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electronの初期化が完了したらウィンドウを作成
app.whenReady().then(() => {
  // macOSでは通知の許可を確認
  if (process.platform === 'darwin') {
    app.setAppUserModelId(process.execPath);
  }
  
  createWindow();

  // macOSでは、ユーザーがDockアイコンをクリックしたときに
  // ウィンドウがない場合は新しいウィンドウを作成する
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  
  // 通知が利用可能かチェック
  console.log('通知がサポートされているか:', Notification.isSupported());
});

// すべてのウィンドウが閉じられたときにアプリを終了（Windows & Linux）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC通信を処理するためのモジュール
const { ipcMain } = require('electron');

// レンダラープロセスからの通知リクエストを処理
ipcMain.on('show-notification', async (event, notificationOptions) => {
  console.log('通知リクエストを受信:', notificationOptions);
  
  try {
    // macOSの場合は直接osascriptを使用
    if (process.platform === 'darwin') {
      console.log('macOSネイティブ通知を使用します');
      await showMacOSNotification(
        notificationOptions.title || 'Electron通知',
        notificationOptions.body || 'これはElectronからの通知です！'
      );
      // 通知がクリックされたことをシミュレート（macOSではクリックイベントを取得できないため）
      setTimeout(() => {
        console.log('通知クリックをシミュレート');
        event.sender.send('notification-clicked');
      }, 5000); // 5秒後にクリックイベントをシミュレート
      return;
    }
    
    // Electron通知を使用
    const notification = new Notification({
      title: notificationOptions.title || 'Electron通知',
      body: notificationOptions.body || 'これはElectronからの通知です！',
      silent: notificationOptions.silent || false
    });
    
    console.log('通知オブジェクトを作成しました');
    
    // 通知を表示
    notification.show();
    console.log('通知を表示しました');
    
    // 通知がクリックされたときのイベント
    notification.on('click', () => {
      console.log('通知がクリックされました');
      event.sender.send('notification-clicked');
    });
    
    // 通知が閉じられたときのイベント
    notification.on('close', () => {
      console.log('通知が閉じられました');
    });
    
    // 通知が表示されたときのイベント
    notification.on('show', () => {
      console.log('通知が表示されました');
    });
  } catch (error) {
    console.error('通知の表示中にエラーが発生しました:', error);
  }
}); 