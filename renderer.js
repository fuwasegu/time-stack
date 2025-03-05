// DOM要素の取得
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const iconSelect = document.getElementById('icon');
const triggerButton = document.getElementById('trigger-button');
const logContainer = document.getElementById('log-container');

// ログにメッセージを追加する関数
function addLog(message) {
  console.log('ログに追加:', message);
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  logContainer.prepend(logEntry);
}

// 初期化時のログ
addLog('アプリケーションが起動しました');

try {
  // 通知がクリックされたときのイベントリスナー
  window.electronAPI.onNotificationClick(() => {
    addLog('通知がクリックされました');
  });

  // 通知を表示するボタンのイベントリスナー
  triggerButton.addEventListener('click', () => {
    const title = titleInput.value || 'Electron通知';
    const body = bodyInput.value || 'これはElectronからの通知です！';
    let icon = 'info';
    
    // アイコンの選択に基づいてアイコンを設定
    switch(iconSelect.value) {
      case 'info':
        icon = 'info';
        break;
      case 'warning':
        icon = 'warning';
        break;
      case 'error':
        icon = 'error';
        break;
      default:
        icon = 'info';
    }
    
    // 通知オプションの設定
    const notificationOptions = {
      title: title,
      body: body,
      silent: false
    };
    
    console.log('通知を送信します:', notificationOptions);
    
    // 通知を表示
    window.electronAPI.showNotification(notificationOptions);
    
    // ログに記録
    addLog(`通知を送信しました: "${title}" - ${body}`);
  });
} catch (error) {
  console.error('エラーが発生しました:', error);
  addLog(`エラーが発生しました: ${error.message}`);
} 