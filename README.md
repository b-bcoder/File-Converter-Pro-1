# File Converter Pro (FCP)

File Converter Pro is a Windows desktop application for converting image, video, audio and PDF files locally on your device. Conversion and transcription run locally and do not upload your files to an online service. Internet access is only used for the optional GitHub update check.

## Overview

FCP is designed for fast local file conversion with support for batch processing, file and folder conversion, and output packaging in ZIP archives.

It is built with Electron, React, Vite and FFmpeg, allowing it to handle a wide range of media conversion tasks without requiring a cloud backend.

## Features

- Convert images to JPG, PNG, WEBP, HEIC, AVIF, PDF, ICO and SVG
- Convert videos to MP4, WEBM, WMV and MKV
- Convert audio to MP3, WAV, FLAC and OGG
- Transcribe audio locally to TXT or SRT with the bundled Whisper engine
- Extract text from PDF files
- Merge multiple images into a single PDF
- Process files and folders in batches
- Choose a local output folder for converted files
- Retry failed conversions individually or as a group
- Show native FFmpeg conversion progress and estimated remaining time
- Stage input files in temporary local storage during conversion
- Optionally delete source files only after successful output
- Check GitHub Releases for available Windows updates
- Download results as ZIP archives
- Protect ZIP archives with AES-256 encryption
- Multilingual interface and first-run guide
- Light and dark mode
- Borderless fullscreen support with F11
- Dedicated GPU detection and native FFmpeg integration

## Technologies

- Electron
- React
- Vite
- TypeScript
- FFmpeg
- Sharp
- PDF.js
- jsPDF

## Installation

Before running the project, install Node.js on your machine. The app uses npm scripts, so Node.js is required for the commands below.

1. Download and install Node.js from: https://nodejs.org/
2. Open a terminal in the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the app in development mode:

```bash
npm run dev
```

5. To build the project and generate the Windows installer locally:

```bash
npm run dist
```

> Note: the generated installer is large and is intended for local use or distribution outside GitHub, not for uploading to GitHub because of the file size limit.

The current Windows installer is `release/File Converter Pro Setup 1.0.3.exe`. It includes Whisper, its runtime files and the base English model, so end users do not need MSYS2, a separate Whisper installation or internet access for transcription.

## Usage

- Start the app from the desktop shortcut or installed executable.
- Select the source files or folders.
- Choose the desired output format.
- Optionally choose an output folder in Settings.
- Start the conversion and monitor the per-file progress and estimated remaining time.
- Download individual results or package successful results in a ZIP archive.
- Retry individual failed conversions or all failed conversions.

The optional source-file deletion setting is disabled by default. When enabled, files are first copied to temporary local storage and are deleted from their original location only after the converted output has been written successfully. This action cannot be undone and requires confirmation before each conversion run.

The app checks the [GitHub Releases](https://github.com/uihorsewolf-design/File-Converter-Pro-1/releases) page for a newer Windows installer when an internet connection is available. Updates are never downloaded or installed without user confirmation.

For audio transcription, add an audio file, choose `TXT` or `SRT`, and select `Convert All`. WAV input is automatically normalized before Whisper processes it.

## Project structure

```text
.
├── App.tsx
├── index.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── metadata.json
├── i18n.ts
├── types.ts
├── preload.js
├── electron-main.cjs
├── services/
│   └── fileConverter.ts
├── README Files & Short Guides/
│   ├── README (Deutsch).md
│   ├── README (English).md
│   ├── README (Francais).md
│   ├── README (Nederlands).md
│   ├── README (Turkce).md
│   ├── README (中文).md
│   ├── README (日本語).md
│   ├── Short Guide (Deutsch).md
│   ├── Short Guide (English).md
│   ├── Short Guide (Francais).md
│   ├── Short Guide (Nederlands).md
│   ├── Short Guide (Turkce).md
│   ├── Short Guide (中文).md
│   └── Short Guide (日本語).md
└── assets/
    └── icon.ico


## Documentation

Additional localized documentation is available in the folder:

- [README Files & Short Guides](README%20Files%20%26%20Short%20Guides)

## Author

B&B Coder

## License

This project is distributed under its project-specific licensing terms. Please review the package and release documentation before distributing or reusing the software.
