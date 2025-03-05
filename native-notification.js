const { exec } = require('child_process');

/**
 * macOSのネイティブ通知を表示する関数
 * @param {string} title 通知のタイトル
 * @param {string} body 通知の本文
 * @returns {Promise<void>}
 */
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

module.exports = {
  showMacOSNotification
}; 