const { contextBridge, ipcRenderer } = require('electron');
// uuidパッケージのインポートを削除
// const path = require('path');
// const { v4: uuidv4 } = require(path.join(__dirname, '..', 'node_modules', 'uuid'));

// レンダラープロセスに公開するAPIを定義
contextBridge.exposeInMainWorld('electronAPI', {
  // タイマーデータの取得
  getTimers: async () => {
    return await ipcRenderer.invoke('get-timers');
  },
  
  // タイマーデータの保存
  saveTimers: async (timers) => {
    return await ipcRenderer.invoke('save-timers', timers);
  },
  
  // 通知の表示
  showNotification: async (options) => {
    return await ipcRenderer.invoke('show-notification', options);
  },
  
  // 設定の取得
  getSettings: async () => {
    return await ipcRenderer.invoke('get-settings');
  },
  
  // 設定の保存
  saveSettings: async (settings) => {
    return await ipcRenderer.invoke('save-settings', settings);
  },
  
  // UUID生成
  generateUUID: async () => {
    return await ipcRenderer.invoke('generate-uuid');
  }
}); 