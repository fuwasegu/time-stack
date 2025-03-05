/**
 * タイマーカードを作成する関数
 * @param {Object} timer - タイマーオブジェクト
 * @param {Function} onStart - 開始ボタンクリック時のコールバック
 * @param {Function} onStop - 停止ボタンクリック時のコールバック
 * @param {Function} onReset - リセットボタンクリック時のコールバック
 * @param {Function} onContextMenu - コンテキストメニュー表示時のコールバック
 * @returns {HTMLElement} タイマーカード要素
 */
function createTimerCard(timer, onStart, onStop, onReset, onContextMenu) {
  // タイマーカードの要素を作成
  const card = document.createElement('div');
  card.className = 'timer-card';
  card.dataset.id = timer.id;
  
  // アクティブなタイマーにはアクティブクラスを追加
  if (timer.active) {
    card.classList.add('active');
  }
  
  // タイマーカードのヘッダー
  const header = document.createElement('div');
  header.className = 'timer-header';
  
  // タイマーアイコン
  const icon = document.createElement('div');
  icon.className = 'timer-icon';
  icon.textContent = timer.icon || '⏱️';
  
  // タイマータイトル
  const title = document.createElement('h3');
  title.className = 'timer-title';
  title.textContent = timer.title;
  
  // ヘッダーに要素を追加
  header.appendChild(icon);
  header.appendChild(title);
  
  // ヘッダーコンテナ（ヘッダーと備考を含む）
  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container';
  headerContainer.appendChild(header);
  
  // タイマーノート
  if (timer.notes && timer.notes.trim()) {
    const notes = document.createElement('div');
    notes.className = 'timer-notes';
    notes.textContent = timer.notes;
    headerContainer.appendChild(notes);
  }
  
  // 時間とコントロールを含むコンテナ
  const timeControlContainer = document.createElement('div');
  timeControlContainer.className = 'time-control-container';
  
  // タイマー時間
  const time = document.createElement('div');
  time.className = 'timer-time';
  time.textContent = formatTime(timer.minutes);
  
  // タイマーコントロール
  const controls = document.createElement('div');
  controls.className = 'timer-controls';
  
  // 開始ボタン
  const startBtn = document.createElement('button');
  startBtn.className = 'timer-btn start';
  startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  startBtn.title = '開始';
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onStart(timer.id);
  });
  
  // 停止ボタン
  const stopBtn = document.createElement('button');
  stopBtn.className = 'timer-btn stop';
  stopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
  stopBtn.title = '停止';
  stopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onStop(timer.id);
  });
  
  // リセットボタン
  const resetBtn = document.createElement('button');
  resetBtn.className = 'timer-btn reset';
  resetBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
  resetBtn.title = 'リセット';
  resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onReset(timer.id);
  });
  
  // コントロールに要素を追加
  if (timer.active) {
    controls.appendChild(stopBtn);
  } else {
    controls.appendChild(startBtn);
  }
  controls.appendChild(resetBtn);
  
  // 時間とコントロールをコンテナに追加
  timeControlContainer.appendChild(time);
  timeControlContainer.appendChild(controls);
  
  // 通知バッジ（通知が有効な場合）
  if (timer.notificationEnabled) {
    const badge = document.createElement('div');
    badge.className = 'timer-notification-badge';
    badge.title = `${timer.notificationInterval}分ごとに通知`;
    badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
    card.appendChild(badge);
  }
  
  // カードに要素を追加
  card.appendChild(headerContainer);
  card.appendChild(timeControlContainer);
  
  // コンテキストメニューイベント
  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    onContextMenu(e, timer.id);
  });
  
  return card;
}

/**
 * タイマーカードを更新する関数
 * @param {HTMLElement} cardElement - タイマーカード要素
 * @param {Object} timer - タイマーオブジェクト
 */
function updateTimerCard(cardElement, timer) {
  if (!cardElement) return;
  
  // アクティブ状態を更新
  cardElement.classList.toggle('active', timer.active);
  
  // 時間表示を更新
  const timeElement = cardElement.querySelector('.timer-time');
  if (timeElement) {
    timeElement.textContent = formatTime(timer.minutes);
  }
  
  // コントロールボタンを更新
  const controlsElement = cardElement.querySelector('.timer-controls');
  if (controlsElement) {
    controlsElement.innerHTML = `
      ${!timer.active ? 
        `<button class="timer-btn start" title="開始"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>` : 
        `<button class="timer-btn stop" title="停止"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></button>`
      }
      <button class="timer-btn reset" title="リセット"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></button>
    `;
  }
  
  // イベントリスナーを再設定
  const startBtn = cardElement.querySelector('.timer-btn.start');
  const stopBtn = cardElement.querySelector('.timer-btn.stop');
  const resetBtn = cardElement.querySelector('.timer-btn.reset');
  
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.timerCallbacks?.onStart === 'function') {
        window.timerCallbacks.onStart(timer.id);
      }
    });
  }
  
  if (stopBtn) {
    stopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.timerCallbacks?.onStop === 'function') {
        window.timerCallbacks.onStop(timer.id);
      }
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.timerCallbacks?.onReset === 'function') {
        window.timerCallbacks.onReset(timer.id);
      }
    });
  }
}