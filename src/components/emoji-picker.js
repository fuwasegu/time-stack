/**
 * 絵文字ピッカーを初期化する関数
 * @param {string} buttonSelector - 絵文字ボタンのセレクタ
 * @param {string} pickerSelector - 絵文字ピッカーのセレクタ
 * @param {string} selectedEmojiSelector - 選択された絵文字を表示する要素のセレクタ
 * @param {Function} onEmojiSelect - 絵文字選択時のコールバック関数
 */
function initEmojiPicker(buttonSelector, pickerSelector, selectedEmojiSelector, onEmojiSelect) {
  const button = document.querySelector(buttonSelector);
  const picker = document.querySelector(pickerSelector);
  const selectedEmoji = document.querySelector(selectedEmojiSelector);
  
  if (!button || !picker) return;
  
  // よく使われる絵文字のリスト
  const emojis = [
    '⏱️', '⏰', '⏲️', '🕰️', '⌚', '📅',
    '📆', '🗓️', '📊', '📈', '📉', '📋',
    '📌', '📍', '📎', '📏', '📐', '✂️',
    '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️',
    '🖍️', '📔', '📕', '📗', '📘', '📙',
    '💼', '🗂️', '📁', '📂', '🗄️', '🗃️',
    '📓', '📒', '📑', '🧮', '🔖', '🔗',
    '📰', '🗞️', '📄', '📃', '📜', '📯',
    '📮', '📭', '📬', '📫', '📪', '📦',
    '📤', '📥', '📧', '📨', '📩', '📢',
    '📣', '💬', '💭', '🗯️', '🔊', '🔉',
    '🔈', '🔇', '📱', '📲', '☎️', '📞',
    '📟', '📠', '🔋', '🔌', '💻', '🖥️',
    '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾',
    '💿', '📀', '🧠', '👨‍💻', '👩‍💻', '🤖'
  ];
  
  // 絵文字ピッカーの内容を生成
  function renderEmojiPicker() {
    const emojiList = picker.querySelector('.emoji-list');
    if (!emojiList) return;
    
    emojiList.innerHTML = '';
    
    emojis.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-item';
      emojiItem.textContent = emoji;
      emojiItem.addEventListener('click', () => {
        selectEmoji(emoji);
      });
      
      emojiList.appendChild(emojiItem);
    });
  }
  
  // 絵文字を選択する関数
  function selectEmoji(emoji) {
    if (selectedEmoji) {
      selectedEmoji.textContent = emoji;
    }
    
    if (typeof onEmojiSelect === 'function') {
      onEmojiSelect(emoji);
    }
    
    togglePicker(false);
  }
  
  // 絵文字ピッカーの表示/非表示を切り替える関数
  function togglePicker(show) {
    if (show === undefined) {
      picker.classList.toggle('hidden');
    } else {
      picker.classList.toggle('hidden', !show);
    }
  }
  
  // ボタンクリック時のイベント
  button.addEventListener('click', () => {
    togglePicker();
  });
  
  // ピッカー外クリック時に閉じる
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !picker.contains(e.target)) {
      togglePicker(false);
    }
  });
  
  // 初期化
  renderEmojiPicker();
  
  // 公開API
  return {
    selectEmoji,
    togglePicker
  };
} 