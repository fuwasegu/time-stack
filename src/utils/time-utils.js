/**
 * 時間をフォーマットする関数
 * @param {number} totalMinutes - 合計分数
 * @returns {string} HH:MM 形式の文字列
 */
function formatTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * HH:MM 形式の文字列から分数に変換する関数
 * @param {string} timeString - HH:MM 形式の文字列
 * @returns {number} 合計分数
 */
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60) + minutes;
}

/**
 * 合計時間を計算する関数
 * @param {Array} timers - タイマーの配列
 * @returns {string} HH:MM 形式の合計時間
 */
function calculateTotalTime(timers) {
  const totalMinutes = timers.reduce((total, timer) => {
    return total + timer.minutes;
  }, 0);
  
  return formatTime(totalMinutes);
}

/**
 * 現在の日時を取得する関数
 * @returns {string} YYYY-MM-DD HH:MM:SS 形式の文字列
 */
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
} 