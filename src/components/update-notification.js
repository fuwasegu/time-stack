// 更新通知コンポーネント
class UpdateNotification {
  constructor() {
    // DOM要素
    this.notification = document.getElementById('update-notification');
    this.message = document.getElementById('update-message');
    this.progressContainer = document.getElementById('update-progress-container');
    this.progressBar = document.getElementById('update-progress-bar');
    this.progressText = document.getElementById('update-progress-text');
    this.installBtn = document.getElementById('install-update-btn');
    this.checkBtn = document.getElementById('check-update-btn');
    this.closeBtn = document.getElementById('close-update-notification-btn');
    
    // 状態
    this.isUpdateAvailable = false;
    this.isUpdateDownloaded = false;
    
    // イベントリスナーの設定
    this.setupEventListeners();
    
    // 自動更新イベントのリスナー登録
    this.setupUpdateListeners();
  }
  
  // イベントリスナーの設定
  setupEventListeners() {
    // 更新のインストールボタン
    this.installBtn.addEventListener('click', () => {
      this.installUpdate();
    });
    
    // 更新の確認ボタン
    this.checkBtn.addEventListener('click', () => {
      this.checkForUpdates();
    });
    
    // 閉じるボタン
    this.closeBtn.addEventListener('click', () => {
      this.hideNotification();
    });
  }
  
  // 自動更新イベントのリスナー登録
  setupUpdateListeners() {
    // electronAPIが利用可能かチェック
    if (!window.electronAPI) {
      console.error('electronAPIが利用できません');
      return;
    }
    
    // 更新が利用可能になったときのイベント
    window.electronAPI.onUpdateAvailable((info) => {
      console.log('更新が利用可能です:', info);
      this.isUpdateAvailable = true;
      this.showUpdateAvailable(info);
    });
    
    // 更新のダウンロードの進行状況
    window.electronAPI.onUpdateDownloadProgress((progressObj) => {
      console.log('ダウンロード進行状況:', progressObj);
      this.updateDownloadProgress(progressObj);
    });
    
    // 更新のダウンロードが完了したときのイベント
    window.electronAPI.onUpdateDownloaded((info) => {
      console.log('更新のダウンロードが完了しました:', info);
      this.isUpdateDownloaded = true;
      this.showUpdateDownloaded(info);
    });
    
    // エラーが発生した場合のイベント
    window.electronAPI.onUpdateError((error) => {
      console.error('自動更新エラー:', error);
      this.showUpdateError(error);
    });
  }
  
  // 更新が利用可能になったときの表示
  showUpdateAvailable(info) {
    this.message.textContent = `新しいバージョン ${info.version} がダウンロードされています...`;
    this.progressContainer.classList.remove('hidden');
    this.installBtn.classList.add('hidden');
    this.showNotification();
  }
  
  // 更新のダウンロードの進行状況の更新
  updateDownloadProgress(progressObj) {
    const percent = Math.round(progressObj.percent);
    this.progressBar.style.width = `${percent}%`;
    this.progressText.textContent = `${percent}%`;
    
    // 進行状況が表示されていない場合は表示
    if (this.notification.classList.contains('hidden')) {
      this.showNotification();
    }
    
    // 進行状況コンテナが非表示の場合は表示
    if (this.progressContainer.classList.contains('hidden')) {
      this.progressContainer.classList.remove('hidden');
    }
  }
  
  // 更新のダウンロードが完了したときの表示
  showUpdateDownloaded(info) {
    this.message.textContent = `新しいバージョン ${info.version} のインストール準備ができました。`;
    this.progressContainer.classList.add('hidden');
    this.installBtn.classList.remove('hidden');
    this.showNotification();
  }
  
  // 更新エラーの表示
  showUpdateError(error) {
    this.message.textContent = `更新中にエラーが発生しました: ${error.message || '不明なエラー'}`;
    this.progressContainer.classList.add('hidden');
    this.installBtn.classList.add('hidden');
    this.showNotification();
    
    // 5秒後に自動的に閉じる
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }
  
  // 通知の表示
  showNotification() {
    this.notification.classList.remove('hidden');
  }
  
  // 通知の非表示
  hideNotification() {
    this.notification.classList.add('hidden');
  }
  
  // 更新の確認
  async checkForUpdates() {
    try {
      this.message.textContent = '更新を確認しています...';
      this.progressContainer.classList.add('hidden');
      this.installBtn.classList.add('hidden');
      this.showNotification();
      
      // electronAPIが利用可能かチェック
      if (!window.electronAPI) {
        throw new Error('electronAPIが利用できません');
      }
      
      const result = await window.electronAPI.checkForUpdates();
      
      if (!result.success) {
        throw new Error(result.message || '更新の確認に失敗しました');
      }
      
      // 更新が見つからない場合（ダウンロードが開始されない場合）
      if (!this.isUpdateAvailable && !this.isUpdateDownloaded) {
        this.message.textContent = '最新バージョンを使用しています。';
        
        // 3秒後に自動的に閉じる
        setTimeout(() => {
          this.hideNotification();
        }, 3000);
      }
    } catch (error) {
      console.error('更新の確認中にエラーが発生しました:', error);
      this.showUpdateError(error);
    }
  }
  
  // 更新のインストール
  async installUpdate() {
    try {
      // electronAPIが利用可能かチェック
      if (!window.electronAPI) {
        throw new Error('electronAPIが利用できません');
      }
      
      const result = await window.electronAPI.installUpdate();
      
      if (!result.success) {
        throw new Error(result.message || '更新のインストールに失敗しました');
      }
    } catch (error) {
      console.error('更新のインストール中にエラーが発生しました:', error);
      this.showUpdateError(error);
    }
  }
}

// DOMの読み込みが完了したら初期化
document.addEventListener('DOMContentLoaded', () => {
  // 更新通知コンポーネントの初期化
  window.updateNotification = new UpdateNotification();
}); 