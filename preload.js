// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.jsが読み込まれました');

// レンダラープロセスに公開するAPIを定義
contextBridge.exposeInMainWorld('electronAPI', {
  // 通知を表示する関数
  showNotification: (options) => {
    console.log('preload: 通知リクエストを送信します', options);
    ipcRenderer.send('show-notification', options);
  },
  
  // 通知がクリックされたときのコールバックを設定
  onNotificationClick: (callback) => {
    console.log('preload: 通知クリックイベントリスナーを設定します');
    ipcRenderer.on('notification-clicked', () => {
      console.log('preload: 通知クリックイベントを受信しました');
      callback();
    });
  }
});

console.log('preload.jsの処理が完了しました'); 