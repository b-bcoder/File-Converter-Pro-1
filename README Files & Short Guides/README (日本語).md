# File Converter Pro (FCP)

File Converter Pro は、画像、動画、音声、PDF ファイルをローカルで変換できる Windows デスクトップアプリです。ファイルがオンラインサービスへアップロードされることはありません。

## 制作者

**作者:** B&B Coder  
**プロジェクト:** FCP (File Converter Pro)

## 機能

- 画像を JPG、PNG、WEBP、HEIC、AVIF、PDF、ICO、SVG に変換
- 動画を MP4、WEBM、WMV、MKV に変換
- 音声を MP3、WAV、FLAC、OGG に変換
- PDF ファイルからテキストを抽出
- 複数の画像を 1 つの PDF に結合
- ファイルやフォルダーを一括処理
- 出力解像度を変更
- 結果を ZIP ファイルとしてダウンロード
- AES-256 パスワードで ZIP を保護
- 多言語インターフェースと初回起動ガイド
- ライトテーマとダークテーマ
- `F11` によるボーダーレス全画面表示
- 専用 GPU の検出と Electron のネイティブ FFmpeg

## インストール

1. `release` フォルダーを開きます。
2. `File Converter Pro Setup 0.0.3.exe` を実行します。
3. Windows のインストール手順に従います。
4. スタートメニューまたはショートカットからアプリを起動します。

完全な `.exe` インストーラーを使用してください。`.blockmap` ファイルと `.__uninstaller.exe` ファイルはインストーラーではありません。
インストール後、Windows はデスクトップにショートカットを作成します。アプリはデフォルトでボーダーレス全画面モードで自動的に起動します。インストールされたファイルは `%LOCALAPPDATA%\Programs\bestandsconverter` に保存されます。

## 使い方

1. `Browse Files` でファイル、または `Browse Folder` でフォルダーを追加します。
2. ファイルをウィンドウへドラッグすることもできます。
3. 各ファイルの出力形式と、必要に応じて解像度を選択します。
4. 複数のファイルを処理する場合は一括操作を使用します。
5. `Convert All` を選択します。
6. 結果を個別に、または ZIP としてダウンロードします。

最適な結果を得るには、破損していないソースファイル、目的に合った形式、適切な解像度を使用してください。大きなメディアファイルは処理に時間がかかる場合があります。

## GPU アクセラレーション

アプリは起動時にビデオアダプターを確認します。統合 GPU しか検出されない場合、Electron のハードウェアアクセラレーションは無効になります。専用 GPU がある場合は有効なままです。対応する動画出力では、NVIDIA GPU は `h264_nvenc`、AMD GPU は `h264_amf` を使用できます。音声はネイティブ FFmpeg で処理されます。

## ショートカット

- `F11`: 全画面表示の切り替え

Electron のメニューバーは非表示です。アプリはボーダーレス全画面で起動します。

## 初回起動

初回起動時に言語を選択します。その後、選択した言語で短いガイドが表示されます。言語設定はローカルに保存され、ガイドは再表示されません。

## 開発

必要条件: Windows 10 以降、Node.js 18 以降、npm。

```powershell
npm install
npm rebuild ffmpeg-static --foreground-scripts
npm run dev
```

その他のコマンド:

```powershell
npm run lint
npm run build
npm run dist
```

インストーラーは `release/File Converter Pro Setup <バージョン>.exe` に作成されます。

## 使用ライブラリ

- React と React DOM: ユーザーインターフェース
- TypeScript と Vite: 開発とビルド
- Electron: デスクトップランタイム
- electron-builder: Windows インストーラー
- FFmpeg と `ffmpeg-static`: 動画・音声変換
- PDF.js と jsPDF: PDF の読み込みと作成
- libheif-js: HEIC/AVIF 対応
- ImageTracerJS: SVG 変換
- zip.js: ZIP と AES-256 暗号化
- Tailwind CSS、PostCSS、Autoprefixer: スタイリング
- `concurrently`: Vite と Electron の同時起動

## 技術とプライバシー

Renderer は `contextIsolation: true` と `nodeIntegration: false` を使用します。ネイティブ機能は制限された preload IPC API を通じて提供されます。変換はローカルで実行されます。インターネットが必要なのは最初の npm インストール時だけです。

## クレジット

**制作者 / 作者:** B&B Coder  
**プロジェクト:** File Converter Pro (FCP)
