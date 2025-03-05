// DOM要素
const timersContainer = document.getElementById('timers-container');
const totalTimeElement = document.getElementById('total-time');
const addTimerBtn = document.getElementById('add-timer-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const timerModal = document.getElementById('timer-modal');
const modalTitle = document.getElementById('modal-title');
const closeModalBtn = document.getElementById('close-modal-btn');
const timerForm = document.getElementById('timer-form');
const timerTitleInput = document.getElementById('timer-title');
const timerNotesInput = document.getElementById('timer-notes');
const enableNotificationCheckbox = document.getElementById('enable-notification');
const notificationIntervalContainer = document.getElementById('notification-interval-container');
const notificationIntervalInput = document.getElementById('notification-interval');
const timerTimeContainer = document.getElementById('timer-time-container');
const timerHoursInput = document.getElementById('timer-hours');
const timerMinutesInput = document.getElementById('timer-minutes');
const saveTimerBtn = document.getElementById('save-timer-btn');
const cancelTimerBtn = document.getElementById('cancel-timer-btn');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesBtn = document.getElementById('confirm-yes-btn');
const confirmNoBtn = document.getElementById('confirm-no-btn');
const closeConfirmBtn = document.getElementById('close-confirm-btn');
const contextMenu = document.getElementById('context-menu');
const editTimerMenuItem = document.getElementById('edit-timer');
const editTimeMenuItem = document.getElementById('edit-time');
const deleteTimerMenuItem = document.getElementById('delete-timer');

// アプリケーションの状態
let timers = [];
let activeTimerId = null;
let activeTimer = null;
let editingTimerId = null;
let timerInterval = null;
let notificationIntervals = {};
// デバッグモードかどうか
const isDev = true; // デバッグ用に常にtrueに設定

// 絵文字ピッカーの初期化
const emojiPicker = initEmojiPicker(
  '#emoji-picker-btn',
  '#emoji-picker',
  '#selected-emoji',
  (emoji) => {
    // 選択された絵文字を保存
    selectedEmoji = emoji;
  }
);

// ドラッグアンドドロップの初期化
const setupDragEvents = initDragAndDrop(
  '#timers-container',
  '.timer-card',
  (newOrder) => {
    // タイマーの順序を更新
    const reorderedTimers = newOrder.map(id => 
      timers.find(timer => timer.id === id)
    ).filter(Boolean);
    
    timers = reorderedTimers;
    saveTimers();
  }
);

// タイマーコールバックをグローバルに設定
window.timerCallbacks = {
  onStart: startTimer,
  onStop: stopTimer,
  onReset: resetTimer
};

// 初期化
async function init() {
  // タイマーデータを読み込む
  timers = await window.electronAPI.getTimers() || [];
  
  // タイマーを表示
  renderTimers();
  
  // 合計時間を更新
  updateTotalTime();
  
  // アクティブなタイマーがあれば再開
  const activeTimerObj = timers.find(timer => timer.active);
  if (activeTimerObj) {
    activeTimerId = activeTimerObj.id;
    activeTimer = activeTimerObj;
    startTimerInterval();
  }
}

// タイマーを表示する関数
function renderTimers() {
  timersContainer.innerHTML = '';
  
  timers.forEach(timer => {
    const card = createTimerCard(
      timer,
      startTimer,
      stopTimer,
      resetTimer,
      showContextMenu
    );
    
    timersContainer.appendChild(card);
  });
  
  // ドラッグイベントを再設定
  setupDragEvents();
}

// タイマーを開始する関数
function startTimer(timerId) {
  // 既に動いているタイマーがあれば停止
  if (activeTimerId && activeTimerId !== timerId) {
    stopTimer(activeTimerId);
  }
  
  // タイマーを開始
  const timerIndex = timers.findIndex(t => t.id === timerId);
  if (timerIndex !== -1) {
    timers[timerIndex].active = true;
    activeTimerId = timerId;
    activeTimer = timers[timerIndex];
    
    // タイマーカードを更新
    const timerCard = document.querySelector(`.timer-card[data-id="${timerId}"]`);
    if (timerCard) {
      updateTimerCard(timerCard, timers[timerIndex]);
    }
    
    // タイマーのインターバルを開始
    startTimerInterval();
    
    // 通知インターバルを設定
    if (activeTimer.notificationEnabled) {
      startNotificationInterval(activeTimer);
    }
    
    // タイマーデータを保存
    saveTimers();
  }
}

// タイマーを停止する関数
function stopTimer(timerId) {
  const timerIndex = timers.findIndex(t => t.id === timerId);
  if (timerIndex !== -1) {
    timers[timerIndex].active = false;
    
    // タイマーカードを更新
    const timerCard = document.querySelector(`.timer-card[data-id="${timerId}"]`);
    if (timerCard) {
      updateTimerCard(timerCard, timers[timerIndex]);
    }
    
    // アクティブタイマーをクリア
    if (activeTimerId === timerId) {
      activeTimerId = null;
      activeTimer = null;
      clearInterval(timerInterval);
      timerInterval = null;
      
      // 通知インターバルをクリア
      clearNotificationInterval(timerId);
    }
    
    // タイマーデータを保存
    saveTimers();
  }
}

// タイマーをリセットする関数
function resetTimer(timerId) {
  const timerIndex = timers.findIndex(t => t.id === timerId);
  if (timerIndex !== -1) {
    // タイマーを停止
    if (timers[timerIndex].active) {
      stopTimer(timerId);
    }
    
    // 時間をリセット
    timers[timerIndex].minutes = 0;
    
    // タイマーカードを更新
    const timerCard = document.querySelector(`.timer-card[data-id="${timerId}"]`);
    if (timerCard) {
      updateTimerCard(timerCard, timers[timerIndex]);
    }
    
    // 合計時間を更新
    updateTotalTime();
    
    // タイマーデータを保存
    saveTimers();
  }
}

// タイマーのインターバルを開始する関数
function startTimerInterval() {
  // 既存のインターバルをクリア
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  console.log('タイマーインターバルを開始します');
  
  // デバッグ用に短い間隔（1秒）でタイマーを更新
  // 本番環境では60000（1分）に戻す
  const intervalTime = isDev ? 1000 : 60000;
  
  timerInterval = setInterval(() => {
    if (activeTimer) {
      console.log(`タイマー更新: ${activeTimer.title}, 現在: ${activeTimer.minutes}分`);
      
      // 時間を増やす（デバッグモードでは1秒ごとに1分増加、本番では1分ごとに1分増加）
      activeTimer.minutes += 1;
      
      // タイマーカードを更新
      const timerCard = document.querySelector(`.timer-card[data-id="${activeTimer.id}"]`);
      if (timerCard) {
        updateTimerCard(timerCard, activeTimer);
      }
      
      // 合計時間を更新
      updateTotalTime();
      
      // タイマーデータを保存
      saveTimers();
    }
  }, intervalTime); // デバッグ用に1秒、本番用に1分
}

// 通知インターバルを開始する関数
function startNotificationInterval(timer) {
  // 既存の通知インターバルをクリア
  clearNotificationInterval(timer.id);
  
  // 通知インターバルを設定
  const intervalMinutes = timer.notificationInterval || 30;
  notificationIntervals[timer.id] = setInterval(() => {
    // 通知を表示
    window.electronAPI.showNotification({
      title: `${timer.title} - ${formatTime(timer.minutes)}`,
      body: `${intervalMinutes}分経過しました`
    });
  }, intervalMinutes * 60000); // 分をミリ秒に変換
}

// 通知インターバルをクリアする関数
function clearNotificationInterval(timerId) {
  if (notificationIntervals[timerId]) {
    clearInterval(notificationIntervals[timerId]);
    delete notificationIntervals[timerId];
  }
}

// 合計時間を更新する関数
function updateTotalTime() {
  const totalTime = calculateTotalTime(timers);
  totalTimeElement.textContent = totalTime;
}

// タイマーデータを保存する関数
async function saveTimers() {
  await window.electronAPI.saveTimers(timers);
}

// モーダルを表示する関数
function showModal(isEditing = false, timer = null) {
  // モーダルのタイトルを設定
  modalTitle.textContent = isEditing ? 'タイマーを編集' : '新規タイマー';
  
  // 編集モードの場合はフォームに値を設定
  if (isEditing && timer) {
    timerTitleInput.value = timer.title;
    timerNotesInput.value = timer.notes || '';
    document.getElementById('selected-emoji').textContent = timer.icon || '⏱️';
    enableNotificationCheckbox.checked = timer.notificationEnabled || false;
    notificationIntervalInput.value = timer.notificationInterval || 30;
    notificationIntervalContainer.classList.toggle('hidden', !timer.notificationEnabled);
    editingTimerId = timer.id;
  } else {
    // 新規モードの場合はフォームをリセット
    timerForm.reset();
    document.getElementById('selected-emoji').textContent = '⏱️';
    notificationIntervalContainer.classList.add('hidden');
    editingTimerId = null;
  }
  
  // 時間編集モードかどうか
  timerTimeContainer.style.display = 'none';
  
  // モーダルを表示
  timerModal.classList.add('show');
}

// 時間編集モーダルを表示する関数
function showTimeEditModal(timer) {
  if (!timer) return;
  
  // モーダルのタイトルを設定
  modalTitle.textContent = '時間を編集';
  
  // フォームに値を設定
  timerTitleInput.value = timer.title;
  timerNotesInput.value = timer.notes || '';
  document.getElementById('selected-emoji').textContent = timer.icon || '⏱️';
  enableNotificationCheckbox.checked = timer.notificationEnabled || false;
  notificationIntervalInput.value = timer.notificationInterval || 30;
  notificationIntervalContainer.classList.toggle('hidden', !timer.notificationEnabled);
  
  // 時間入力を表示
  timerTimeContainer.style.display = 'block';
  const hours = Math.floor(timer.minutes / 60);
  const minutes = timer.minutes % 60;
  timerHoursInput.value = hours;
  timerMinutesInput.value = minutes;
  
  editingTimerId = timer.id;
  
  // モーダルを表示
  timerModal.classList.add('show');
}

// モーダルを閉じる関数
function closeModal() {
  timerModal.classList.remove('show');
  editingTimerId = null;
}

// 確認ダイアログを表示する関数
function showConfirmDialog(message, onConfirm) {
  confirmMessage.textContent = message;
  confirmDialog.classList.add('show');
  
  // 確認ボタンのイベントリスナーを設定
  const confirmHandler = () => {
    onConfirm();
    confirmYesBtn.removeEventListener('click', confirmHandler);
    closeConfirmDialog();
  };
  
  confirmYesBtn.addEventListener('click', confirmHandler);
}

// 確認ダイアログを閉じる関数
function closeConfirmDialog() {
  confirmDialog.classList.remove('show');
}

// コンテキストメニューを表示する関数
function showContextMenu(event, timerId) {
  // コンテキストメニューの位置を設定
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.top = `${event.clientY}px`;
  
  // コンテキストメニューを表示
  contextMenu.classList.add('show');
  contextMenu.dataset.timerId = timerId;
  
  // クリックイベントを設定
  const handleClick = () => {
    contextMenu.classList.remove('show');
    document.removeEventListener('click', handleClick);
  };
  
  // 次のクリックでメニューを閉じる
  setTimeout(() => {
    document.addEventListener('click', handleClick);
  }, 0);
}

// タイマーを作成/更新する関数
function createOrUpdateTimer() {
  const title = timerTitleInput.value.trim();
  if (!title) return;
  
  const icon = document.getElementById('selected-emoji').textContent;
  const notes = timerNotesInput.value.trim();
  const notificationEnabled = enableNotificationCheckbox.checked;
  const notificationInterval = parseInt(notificationIntervalInput.value) || 30;
  
  // 時間編集モードの場合
  let minutes = 0;
  if (timerTimeContainer.style.display !== 'none') {
    const hours = parseInt(timerHoursInput.value) || 0;
    const mins = parseInt(timerMinutesInput.value) || 0;
    minutes = (hours * 60) + mins;
  }
  
  if (editingTimerId) {
    // 既存のタイマーを更新
    const timerIndex = timers.findIndex(t => t.id === editingTimerId);
    if (timerIndex !== -1) {
      // 時間編集モードの場合は時間を更新
      if (timerTimeContainer.style.display !== 'none') {
        timers[timerIndex].minutes = minutes;
      }
      
      timers[timerIndex].title = title;
      timers[timerIndex].icon = icon;
      timers[timerIndex].notes = notes;
      timers[timerIndex].notificationEnabled = notificationEnabled;
      timers[timerIndex].notificationInterval = notificationInterval;
      
      // 通知設定が変更された場合、通知インターバルを更新
      if (timers[timerIndex].active && timers[timerIndex].notificationEnabled) {
        clearNotificationInterval(editingTimerId);
        startNotificationInterval(timers[timerIndex]);
      } else if (!timers[timerIndex].notificationEnabled) {
        clearNotificationInterval(editingTimerId);
      }
    }
  } else {
    // 新しいタイマーを作成
    const newTimer = {
      id: Date.now().toString(),
      title,
      icon,
      notes,
      minutes: 0,
      active: false,
      notificationEnabled,
      notificationInterval
    };
    
    timers.push(newTimer);
  }
  
  // タイマーを保存して表示を更新
  saveTimers();
  renderTimers();
  updateTotalTime();
  
  // モーダルを閉じる
  closeModal();
}

// タイマーを削除する関数
function deleteTimer(timerId) {
  const timerIndex = timers.findIndex(t => t.id === timerId);
  if (timerIndex !== -1) {
    // アクティブなタイマーなら停止
    if (timers[timerIndex].active) {
      stopTimer(timerId);
    }
    
    // タイマーを削除
    timers.splice(timerIndex, 1);
    
    // タイマーを保存して表示を更新
    saveTimers();
    renderTimers();
    updateTotalTime();
  }
}

// 全てのタイマーをクリアする関数
function clearAllTimers() {
  // アクティブなタイマーがあれば停止
  if (activeTimerId) {
    stopTimer(activeTimerId);
  }
  
  // 全ての通知インターバルをクリア
  Object.keys(notificationIntervals).forEach(id => {
    clearNotificationInterval(id);
  });
  
  // タイマーをクリア
  timers = [];
  
  // タイマーを保存して表示を更新
  saveTimers();
  renderTimers();
  updateTotalTime();
}

// イベントリスナー
// 新規タイマーボタン
addTimerBtn.addEventListener('click', () => {
  showModal();
});

// 全てクリアボタン
clearAllBtn.addEventListener('click', () => {
  if (timers.length === 0) return;
  
  showConfirmDialog('全てのタイマーをクリアしますか？', clearAllTimers);
});

// モーダルを閉じるボタン
closeModalBtn.addEventListener('click', closeModal);
cancelTimerBtn.addEventListener('click', closeModal);

// 通知設定のチェックボックス
enableNotificationCheckbox.addEventListener('change', () => {
  notificationIntervalContainer.classList.toggle('hidden', !enableNotificationCheckbox.checked);
});

// タイマーフォームの送信
timerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  createOrUpdateTimer();
});

// 確認ダイアログを閉じるボタン
closeConfirmBtn.addEventListener('click', closeConfirmDialog);
confirmNoBtn.addEventListener('click', closeConfirmDialog);

// コンテキストメニューのアイテム
editTimerMenuItem.addEventListener('click', () => {
  const timerId = contextMenu.dataset.timerId;
  if (timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (timer) {
      showModal(true, timer);
    }
  }
});

editTimeMenuItem.addEventListener('click', () => {
  const timerId = contextMenu.dataset.timerId;
  if (timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (timer) {
      showTimeEditModal(timer);
    }
  }
});

deleteTimerMenuItem.addEventListener('click', () => {
  const timerId = contextMenu.dataset.timerId;
  if (timerId) {
    showConfirmDialog('このタイマーを削除しますか？', () => {
      deleteTimer(timerId);
    });
  }
});

// 初期化
init(); 