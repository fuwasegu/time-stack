const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { exec } = require('child_process');

// パスの設定
const originalIconPath = path.join(__dirname, 'original', 'icon.png');
const trayIconPath = path.join(__dirname, 'tray-icon.png');
const iconsetDir = path.join(__dirname, '..', '..', 'build', 'icon.iconset');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(iconsetDir)) {
  fs.mkdirSync(iconsetDir, { recursive: true });
}

// 画像の角を丸くする関数
function roundedImage(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
}

// トレイアイコンを作成する関数（16x16）
async function createTrayIcon() {
  try {
    const image = await loadImage(originalIconPath);
    const canvas = createCanvas(16, 16);
    const ctx = canvas.getContext('2d');
    
    // 背景を透明に
    ctx.clearRect(0, 0, 16, 16);
    
    // 角を丸くする（半径は2px）
    roundedImage(ctx, 0, 0, 16, 16, 4);
    
    // 画像を16x16にリサイズして描画
    ctx.drawImage(image, 0, 0, 16, 16);
    
    // PNGとして保存
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(trayIconPath, buffer);
    
    console.log(`トレイアイコンを作成しました: ${trayIconPath}`);
  } catch (error) {
    console.error('トレイアイコンの作成中にエラーが発生しました:', error);
  }
}

// macOS用のiconsetを作成する関数
async function createMacOSIconset() {
  try {
    const sizes = [16, 32, 64, 128, 256, 512, 1024];
    
    for (const size of sizes) {
      const image = await loadImage(originalIconPath);
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // 背景を透明に
      ctx.clearRect(0, 0, size, size);
      
      // 角を丸くする（サイズに応じて半径を調整）
      const radius = Math.max(size * 0.2, 8); // サイズの20%か最小8pxの大きい方
      roundedImage(ctx, 0, 0, size, size, radius);
      
      // 画像をリサイズして描画
      ctx.drawImage(image, 0, 0, size, size);
      
      // 通常解像度用のアイコン
      const normalPath = path.join(iconsetDir, `icon_${size}x${size}.png`);
      fs.writeFileSync(normalPath, canvas.toBuffer('image/png'));
      
      // Retina（高解像度）用のアイコン（サイズが512以下の場合のみ）
      if (size <= 512) {
        const retinaSize = size * 2;
        const retinaCanvas = createCanvas(retinaSize, retinaSize);
        const retinaCtx = retinaCanvas.getContext('2d');
        
        // 背景を透明に
        retinaCtx.clearRect(0, 0, retinaSize, retinaSize);
        
        // 角を丸くする（サイズに応じて半径を調整）
        const retinaRadius = Math.max(retinaSize * 0.2, 16); // サイズの20%か最小16pxの大きい方
        roundedImage(retinaCtx, 0, 0, retinaSize, retinaSize, retinaRadius);
        
        // 高解像度用にリサイズ
        retinaCtx.drawImage(image, 0, 0, retinaSize, retinaSize);
        
        const retinaPath = path.join(iconsetDir, `icon_${size}x${size}@2x.png`);
        fs.writeFileSync(retinaPath, retinaCanvas.toBuffer('image/png'));
      }
    }
    
    console.log('macOS用のiconsetを作成しました');
  } catch (error) {
    console.error('iconsetの作成中にエラーが発生しました:', error);
  }
}

// iconsetから.icnsファイルを生成する関数
function createIcnsFile() {
  return new Promise((resolve, reject) => {
    const icnsPath = path.join(__dirname, '..', '..', 'build', 'icon.icns');
    const command = `iconutil -c icns -o "${icnsPath}" "${iconsetDir}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('icnsファイルの生成中にエラーが発生しました:', error);
        reject(error);
        return;
      }
      
      console.log(`icnsファイルを作成しました: ${icnsPath}`);
      resolve();
    });
  });
}

// メイン処理
async function main() {
  try {
    // トレイアイコンを作成
    await createTrayIcon();
    
    // macOS用のiconsetを作成
    await createMacOSIconset();
    
    // iconsetから.icnsファイルを生成
    await createIcnsFile();
    
    console.log('アイコン処理が完了しました');
  } catch (error) {
    console.error('アイコン処理中にエラーが発生しました:', error);
  }
}

// スクリプトを実行
main(); 