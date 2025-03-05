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
  
  // 絵文字カテゴリーとその絵文字
  const emojiCategories = {
    '時間と計測': [
      { emoji: '⏱️', name: 'stopwatch' },
      { emoji: '⏰', name: 'alarm' },
      { emoji: '⏲️', name: 'timer' },
      { emoji: '🕰️', name: 'clock' },
      { emoji: '⌚', name: 'watch' },
      { emoji: '⌛', name: 'hourglass' },
      { emoji: '⏳', name: 'hourglass flowing' },
      { emoji: '🗓️', name: 'calendar' },
      { emoji: '📅', name: 'calendar' },
      { emoji: '📆', name: 'tear-off calendar' },
      { emoji: '🕛', name: 'twelve oclock' },
      { emoji: '🕧', name: 'twelve-thirty' },
      { emoji: '🕐', name: 'one oclock' },
      { emoji: '🕜', name: 'one-thirty' },
      { emoji: '🕑', name: 'two oclock' },
      { emoji: '🕝', name: 'two-thirty' }
    ],
    '仕事と学習': [
      { emoji: '📊', name: 'chart' },
      { emoji: '📈', name: 'chart increasing' },
      { emoji: '📉', name: 'chart decreasing' },
      { emoji: '📋', name: 'clipboard' },
      { emoji: '📌', name: 'pushpin' },
      { emoji: '📍', name: 'pin' },
      { emoji: '📎', name: 'paperclip' },
      { emoji: '📏', name: 'ruler' },
      { emoji: '📐', name: 'triangular ruler' },
      { emoji: '✂️', name: 'scissors' },
      { emoji: '📝', name: 'memo' },
      { emoji: '✏️', name: 'pencil' },
      { emoji: '✒️', name: 'black nib' },
      { emoji: '🖋️', name: 'fountain pen' },
      { emoji: '🖊️', name: 'pen' },
      { emoji: '🖌️', name: 'paintbrush' },
      { emoji: '🖍️', name: 'crayon' },
      { emoji: '📔', name: 'notebook' },
      { emoji: '📕', name: 'closed book' },
      { emoji: '📗', name: 'green book' },
      { emoji: '📘', name: 'blue book' },
      { emoji: '📙', name: 'orange book' },
      { emoji: '💼', name: 'briefcase' },
      { emoji: '🗂️', name: 'card index dividers' },
      { emoji: '📁', name: 'file folder' },
      { emoji: '📂', name: 'open file folder' },
      { emoji: '🗄️', name: 'file cabinet' },
      { emoji: '🗃️', name: 'card file box' },
      { emoji: '📓', name: 'notebook' },
      { emoji: '📒', name: 'ledger' },
      { emoji: '📑', name: 'bookmark tabs' },
      { emoji: '🧮', name: 'abacus' },
      { emoji: '🔖', name: 'bookmark' },
      { emoji: '🔗', name: 'link' }
    ],
    '活動とスポーツ': [
      { emoji: '🏃', name: 'running' },
      { emoji: '🚶', name: 'walking' },
      { emoji: '🧘', name: 'meditation' },
      { emoji: '🏋️', name: 'weight lifting' },
      { emoji: '🤸', name: 'gymnastics' },
      { emoji: '🚴', name: 'cycling' },
      { emoji: '🏊', name: 'swimming' },
      { emoji: '⚽', name: 'soccer' },
      { emoji: '🏀', name: 'basketball' },
      { emoji: '🏈', name: 'american football' },
      { emoji: '⚾', name: 'baseball' },
      { emoji: '🎾', name: 'tennis' },
      { emoji: '🏐', name: 'volleyball' },
      { emoji: '🏉', name: 'rugby' },
      { emoji: '🎱', name: 'pool' },
      { emoji: '🏓', name: 'ping pong' },
      { emoji: '🏸', name: 'badminton' },
      { emoji: '🥊', name: 'boxing' },
      { emoji: '🥋', name: 'martial arts' },
      { emoji: '⛳', name: 'golf' },
      { emoji: '⛷️', name: 'skiing' },
      { emoji: '🏂', name: 'snowboarding' },
      { emoji: '🧗', name: 'climbing' },
      { emoji: '🚣', name: 'rowing' },
      { emoji: '🏄', name: 'surfing' }
    ],
    '食事と健康': [
      { emoji: '🍎', name: 'apple' },
      { emoji: '🍏', name: 'green apple' },
      { emoji: '🍌', name: 'banana' },
      { emoji: '🍇', name: 'grapes' },
      { emoji: '🍓', name: 'strawberry' },
      { emoji: '🥦', name: 'broccoli' },
      { emoji: '🥗', name: 'salad' },
      { emoji: '🍲', name: 'soup' },
      { emoji: '🍱', name: 'bento' },
      { emoji: '🍛', name: 'curry' },
      { emoji: '🍜', name: 'noodles' },
      { emoji: '🍵', name: 'tea' },
      { emoji: '☕', name: 'coffee' },
      { emoji: '🧃', name: 'juice' },
      { emoji: '🥤', name: 'drink' },
      { emoji: '💊', name: 'pill' },
      { emoji: '🩺', name: 'stethoscope' },
      { emoji: '🧠', name: 'brain' },
      { emoji: '❤️', name: 'heart' },
      { emoji: '🧘', name: 'meditation' }
    ],
    '感情と表現': [
      { emoji: '😊', name: 'smile' },
      { emoji: '😃', name: 'grin' },
      { emoji: '😄', name: 'laugh' },
      { emoji: '😁', name: 'beaming' },
      { emoji: '😆', name: 'laughing' },
      { emoji: '😅', name: 'sweat smile' },
      { emoji: '🙂', name: 'slightly smiling' },
      { emoji: '🙃', name: 'upside down' },
      { emoji: '😉', name: 'wink' },
      { emoji: '😌', name: 'relieved' },
      { emoji: '😍', name: 'heart eyes' },
      { emoji: '🥰', name: 'smiling with hearts' },
      { emoji: '😘', name: 'kiss' },
      { emoji: '😗', name: 'kissing' },
      { emoji: '😙', name: 'kissing smiling' },
      { emoji: '😚', name: 'kissing closed eyes' },
      { emoji: '😋', name: 'yum' },
      { emoji: '😛', name: 'tongue' },
      { emoji: '😝', name: 'squinting tongue' },
      { emoji: '😜', name: 'winking tongue' },
      { emoji: '🤪', name: 'zany' },
      { emoji: '🤨', name: 'raised eyebrow' },
      { emoji: '🧐', name: 'monocle' },
      { emoji: '🤓', name: 'nerd' },
      { emoji: '😎', name: 'sunglasses' },
      { emoji: '🤩', name: 'star struck' },
      { emoji: '🥳', name: 'partying' },
      { emoji: '😏', name: 'smirking' },
      { emoji: '😒', name: 'unamused' },
      { emoji: '😞', name: 'disappointed' },
      { emoji: '😔', name: 'sad' },
      { emoji: '😟', name: 'worried' },
      { emoji: '😕', name: 'confused' },
      { emoji: '🙁', name: 'slightly frowning' },
      { emoji: '☹️', name: 'frowning' },
      { emoji: '😣', name: 'persevere' },
      { emoji: '😖', name: 'confounded' },
      { emoji: '😫', name: 'tired' },
      { emoji: '😩', name: 'weary' },
      { emoji: '🥺', name: 'pleading' }
    ],
    'テクノロジー': [
      { emoji: '💻', name: 'laptop' },
      { emoji: '🖥️', name: 'desktop' },
      { emoji: '🖨️', name: 'printer' },
      { emoji: '⌨️', name: 'keyboard' },
      { emoji: '🖱️', name: 'mouse' },
      { emoji: '🖲️', name: 'trackball' },
      { emoji: '💽', name: 'disk' },
      { emoji: '💾', name: 'floppy' },
      { emoji: '💿', name: 'cd' },
      { emoji: '📀', name: 'dvd' },
      { emoji: '📱', name: 'mobile' },
      { emoji: '📲', name: 'phone' },
      { emoji: '☎️', name: 'telephone' },
      { emoji: '📞', name: 'receiver' },
      { emoji: '📟', name: 'pager' },
      { emoji: '📠', name: 'fax' },
      { emoji: '🔋', name: 'battery' },
      { emoji: '🔌', name: 'plug' },
      { emoji: '🧮', name: 'abacus' },
      { emoji: '🔍', name: 'search' },
      { emoji: '🔎', name: 'magnifying glass' },
      { emoji: '🔬', name: 'microscope' },
      { emoji: '🔭', name: 'telescope' },
      { emoji: '📡', name: 'satellite' },
      { emoji: '🔦', name: 'flashlight' },
      { emoji: '🔧', name: 'wrench' },
      { emoji: '🔨', name: 'hammer' },
      { emoji: '🔩', name: 'nut and bolt' },
      { emoji: '⚙️', name: 'gear' },
      { emoji: '🧰', name: 'toolbox' }
    ]
  };
  
  // 絵文字ピッカーのHTMLを更新
  picker.innerHTML = `
    <div class="emoji-search-container">
      <input type="text" id="emoji-search" placeholder="絵文字を検索..." class="emoji-search-input">
    </div>
    <div class="emoji-categories">
      ${Object.keys(emojiCategories).map(category => `
        <div class="emoji-category" data-category="${category}">
          <h3 class="emoji-category-title">${category}</h3>
          <div class="emoji-list">
            ${emojiCategories[category].map(item => `
              <div class="emoji-item" data-name="${item.name}" title="${item.name}">${item.emoji}</div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // 検索機能の実装
  const searchInput = picker.querySelector('#emoji-search');
  const allEmojiItems = picker.querySelectorAll('.emoji-item');
  const categories = picker.querySelectorAll('.emoji-category');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      // 検索語がない場合はすべての絵文字とカテゴリを表示
      allEmojiItems.forEach(item => item.style.display = '');
      categories.forEach(category => category.style.display = '');
      return;
    }
    
    // 各カテゴリごとに検索
    categories.forEach(category => {
      const items = category.querySelectorAll('.emoji-item');
      let hasVisibleItems = false;
      
      items.forEach(item => {
        const name = item.getAttribute('data-name');
        const visible = name.includes(searchTerm);
        item.style.display = visible ? '' : 'none';
        if (visible) hasVisibleItems = true;
      });
      
      // カテゴリ内に表示される絵文字がない場合はカテゴリ自体を非表示
      category.style.display = hasVisibleItems ? '' : 'none';
    });
  });
  
  // 絵文字クリックイベントの設定
  picker.querySelectorAll('.emoji-item').forEach(item => {
    item.addEventListener('click', () => {
      selectEmoji(item.textContent);
    });
  });
  
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
  
  // 絵文字ピッカーの位置を設定する関数
  function positionPicker() {
    const buttonRect = button.getBoundingClientRect();
    picker.style.top = `${buttonRect.bottom + window.scrollY}px`;
    picker.style.left = `${buttonRect.left + window.scrollX}px`;
  }
  
  // 絵文字ピッカーの表示/非表示を切り替える関数
  function togglePicker(show) {
    if (show === undefined) {
      picker.classList.toggle('hidden');
      if (!picker.classList.contains('hidden')) {
        positionPicker();
        searchInput.focus();
      }
    } else {
      picker.classList.toggle('hidden', !show);
      if (show) {
        positionPicker();
        searchInput.focus();
      }
    }
  }
  
  // ボタンクリック時のイベント
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // イベントの伝播を停止
    togglePicker();
  });
  
  // ウィンドウのリサイズ時にピッカーの位置を調整
  window.addEventListener('resize', () => {
    if (!picker.classList.contains('hidden')) {
      positionPicker();
    }
  });
  
  // ピッカー外クリック時に閉じる
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !picker.contains(e.target)) {
      togglePicker(false);
    }
  });
  
  // 公開API
  return {
    selectEmoji,
    togglePicker
  };
} 