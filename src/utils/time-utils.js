/**
 * 時間をフォーマットする関数
 * @param {number} totalSeconds - 合計秒数
 * @returns {string} HH:MM:SS 形式の文字列
 */
function formatTime(totalSeconds) {
  // 小数点以下を切り捨てて整数に変換
  totalSeconds = Math.floor(totalSeconds);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * HH:MM:SS 形式の文字列から秒数に変換する関数
 * @param {string} timeString - HH:MM:SS 形式の文字列
 * @returns {number} 合計秒数
 */
function parseTime(timeString) {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    // HH:MM:SS形式
    const [hours, minutes, seconds] = parts;
    return (hours * 3600) + (minutes * 60) + seconds;
  } else if (parts.length === 2) {
    // HH:MM形式（後方互換性のため）
    const [hours, minutes] = parts;
    return (hours * 3600) + (minutes * 60);
  }
  return 0;
}

/**
 * 合計時間を計算する関数
 * @param {Array} timers - タイマーの配列
 * @returns {string} HH:MM:SS 形式の合計時間
 */
function calculateTotalTime(timers) {
  const totalSeconds = timers.reduce((total, timer) => {
    return total + (timer.seconds || 0);
  }, 0);
  
  return formatTime(totalSeconds);
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