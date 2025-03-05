# Time Stack

タスクごとにタイマーを作成し、時間を計測するElectronアプリケーション。

## 機能

- タイマーの作成、編集、削除
- タイマーのカウントアップ
- タイマーごとの通知設定
- ドラッグアンドドロップによるタイマーの並べ替え
- 合計時間の表示
- データの永続化

## スクリーンショット

![Time Stack]([screenshot.png](https://private-user-images.githubusercontent.com/52437973/419253732-3194c9cc-9b2f-4ab8-8faf-88f10efe26f3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDExMzg3NzksIm5iZiI6MTc0MTEzODQ3OSwicGF0aCI6Ii81MjQzNzk3My80MTkyNTM3MzItMzE5NGM5Y2MtOWIyZi00YWI4LThmYWYtODhmMTBlZmUyNmYzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAzMDUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMzA1VDAxMzQzOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE3MDlhNDUyYjhlMzZiMjEyN2Y1OWNjOTBiZWI2MjBmZTU3Zjg2MDhiODhjNjgzMDRkOWNjZmRlYjY1M2IxYWImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.V9CouOAk0njmiD_IjXYRMFP8uv0h6PWyoVOmM0sZ7eI))

## インストール方法

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/time-stack.git

# プロジェクトディレクトリに移動
cd time-stack

# 依存関係をインストール
npm install

# アプリケーションを起動
npm start
```

## 使用方法

### タイマーの作成

1. 「新規タイマー」ボタンをクリックします
2. タイトル、備考、アイコン、通知設定を入力します
3. 「保存」ボタンをクリックします

### タイマーの操作

- 再生ボタン(▶️)をクリックしてタイマーを開始します
- 停止ボタン(⏹️)をクリックしてタイマーを停止します
- リセットボタン(🔄)をクリックしてタイマーをリセットします

### タイマーの編集

1. タイマーカード上で右クリックします
2. コンテキストメニューから「編集」または「時間の編集」を選択します
3. 必要な変更を行い、「保存」ボタンをクリックします

### タイマーの削除

1. タイマーカード上で右クリックします
2. コンテキストメニューから「削除」を選択します
3. 確認ダイアログで「はい」をクリックします

### 全てのタイマーをクリア

1. 「全てクリア」ボタンをクリックします
2. 確認ダイアログで「はい」をクリックします

## 開発

```bash
# 開発モードで起動（開発者ツールが自動的に開きます）
npm run dev
```

## ライセンス

MIT 
