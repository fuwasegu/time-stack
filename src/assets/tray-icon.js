// トレイアイコンを作成するためのスクリプト
const fs = require('fs');
const path = require('path');

// キャンバス要素を作成（Node.js環境なのでオフスクリーンキャンバスを使用）
const { createCanvas } = require('canvas');
const canvas = createCanvas(16, 16);
const ctx = canvas.getContext('2d');

// 背景を透明に
ctx.clearRect(0, 0, 16, 16);

// 時計の文字盤を描画
ctx.beginPath();
ctx.arc(8, 8, 7, 0, Math.PI * 2);
ctx.fillStyle = '#4CAF50';
ctx.fill();
ctx.strokeStyle = '#333';
ctx.lineWidth = 1;
ctx.stroke();

// 時計の針を描画
ctx.beginPath();
ctx.moveTo(8, 8);
ctx.lineTo(8, 3);
ctx.strokeStyle = '#333';
ctx.lineWidth = 1.5;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(8, 8);
ctx.lineTo(12, 8);
ctx.strokeStyle = '#333';
ctx.lineWidth = 1.5;
ctx.stroke();

// PNGとして保存
const buffer = canvas.toBuffer('image/png');
const iconPath = path.join(__dirname, 'tray-icon.png');
fs.writeFileSync(iconPath, buffer);

console.log(`トレイアイコンを作成しました: ${iconPath}`);

// このスクリプトを実行するには:
// node src/assets/tray-icon.js 