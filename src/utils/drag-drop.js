/**
 * ドラッグアンドドロップ機能を初期化する関数
 * @param {string} containerSelector - コンテナ要素のセレクタ
 * @param {string} itemSelector - ドラッグ可能なアイテムのセレクタ
 * @param {Function} onOrderChange - 順序変更時のコールバック関数
 */
function initDragAndDrop(containerSelector, itemSelector, onOrderChange) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  let draggedItem = null;
  
  // コンテナ内のアイテムにドラッグイベントを設定
  function setupDragEvents() {
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach(item => {
      // ドラッグ開始時
      item.addEventListener('dragstart', function(e) {
        draggedItem = this;
        setTimeout(() => {
          this.classList.add('dragging');
        }, 0);
      });
      
      // ドラッグ終了時
      item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedItem = null;
        
        // 順序変更のコールバックを呼び出す
        if (typeof onOrderChange === 'function') {
          const newOrder = Array.from(container.querySelectorAll(itemSelector)).map(item => item.dataset.id);
          onOrderChange(newOrder);
        }
      });
      
      // ドラッグ中にアイテム上に入った時
      item.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (draggedItem === this) return;
        
        const rect = this.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        // マウスの位置に応じて挿入位置を決定
        if (y < height / 2) {
          container.insertBefore(draggedItem, this);
        } else {
          container.insertBefore(draggedItem, this.nextSibling);
        }
      });
      
      // ドラッグ中にアイテム上に入った時のスタイル変更
      item.addEventListener('dragenter', function(e) {
        e.preventDefault();
        if (draggedItem === this) return;
        this.classList.add('drag-over');
      });
      
      // ドラッグ中にアイテムから出た時のスタイル変更
      item.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
      });
      
      // ドロップ時
      item.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
      });
      
      // ドラッグ可能に設定
      item.setAttribute('draggable', 'true');
    });
  }
  
  // 初期設定
  setupDragEvents();
  
  // 新しいアイテムが追加された時に再設定するための関数を返す
  return setupDragEvents;
} 