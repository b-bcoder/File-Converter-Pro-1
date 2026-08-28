# File Converter Pro (FCP)

File Converter Pro ist eine Windows-Desktopanwendung zum lokalen Konvertieren von Bild-, Video-, Audio- und PDF-Dateien. Dateien werden nicht zu einem Online-Dienst hochgeladen.

## Ersteller

**Autor:** B&B Coder  
**Projekt:** FCP (File Converter Pro)

## Funktionen

- Bilder in JPG, PNG, WEBP, HEIC, AVIF, PDF, ICO und SVG konvertieren
- Videos in MP4, WEBM, WMV und MKV konvertieren
- Audio in MP3, WAV, FLAC und OGG konvertieren
- Text aus PDF-Dateien extrahieren
- Mehrere Bilder zu einer PDF-Datei zusammenfassen
- Dateien und Ordner stapelweise verarbeiten
- Ausgabeauflösung ändern
- Ergebnisse als ZIP-Datei herunterladen
- ZIP-Dateien mit AES-256-Passwort schützen
- Mehrsprachige Oberfläche und Anleitung beim ersten Start
- Helles und dunkles Design
- Randloser Vollbildmodus mit `F11`
- Erkennung dedizierter GPUs und natives FFmpeg in Electron

## Installation

1. Öffnen Sie den Ordner `release`.
2. Starten Sie `File Converter Pro Setup 0.0.3.exe`.
3. Folgen Sie den Windows-Installationsschritten.
4. Starten Sie die App über das Startmenü oder die Verknüpfung.

Verwenden Sie die vollständige `.exe`-Installationsdatei. Eine `.blockmap`-Datei und eine `.__uninstaller.exe`-Datei sind keine Installer.
Nach der Installation erstellt Windows eine Desktopverknüpfung. Die App startet standardmäßig automatisch im randlosen Vollbildmodus. Die installierten Dateien befinden sich lokal unter `%LOCALAPPDATA%\Programs\bestandsconverter`.

## Verwendung

1. Fügen Sie Dateien über `Browse Files` oder einen Ordner über `Browse Folder` hinzu.
2. Dateien können auch in das Fenster gezogen werden.
3. Wählen Sie für jede Datei das Ausgabeformat und bei Bedarf die Auflösung.
4. Verwenden Sie bei mehreren Dateien die Sammelaktionen.
5. Wählen Sie `Convert All`.
6. Laden Sie die Ergebnisse einzeln oder als ZIP-Datei herunter.

Für beste Ergebnisse sollten Sie eine gültige Quelldatei, ein geeignetes Ausgabeformat und eine passende Auflösung verwenden. Große Mediendateien können länger dauern.

## GPU-Beschleunigung

Beim Start prüft die App den installierten Grafikadapter. Wenn nur eine integrierte GPU erkannt wird, deaktiviert Electron die Hardwarebeschleunigung. Bei einer dedizierten GPU bleibt sie aktiviert. NVIDIA-GPUs können `h264_nvenc` und AMD-GPUs `h264_amf` für unterstützte Videoausgaben verwenden. Audio wird nativ über FFmpeg verarbeitet.

## Tastenkürzel

- `F11`: Vollbild ein- oder ausschalten

Die Electron-Menüleiste ist ausgeblendet. Die App startet im randlosen Vollbildmodus.

## Erster Start

Beim ersten Start wählen Sie eine Sprache. Danach erscheint eine kurze Anleitung in dieser Sprache. Die Auswahl wird lokal gespeichert und die Anleitung wird nicht erneut angezeigt.

## Entwicklung

Voraussetzungen: Windows 10 oder neuer, Node.js 18 oder neuer und npm.

```powershell
npm install
npm rebuild ffmpeg-static --foreground-scripts
npm run dev
```

Weitere Befehle:

```powershell
npm run lint
npm run build
npm run dist
```

Der Installer wird unter `release/File Converter Pro Setup <Version>.exe` erstellt.

## Verwendete Libraries

- React und React DOM: Benutzeroberfläche
- TypeScript und Vite: Entwicklung und Builds
- Electron: Desktop-Laufzeit
- electron-builder: Windows-Installer
- FFmpeg und `ffmpeg-static`: Video- und Audiokonvertierung
- PDF.js und jsPDF: PDF lesen und erstellen
- libheif-js: HEIC/AVIF-Unterstützung
- ImageTracerJS: SVG-Konvertierung
- zip.js: ZIP-Dateien und AES-256-Verschlüsselung
- Tailwind CSS, PostCSS und Autoprefixer: Styling
- `concurrently`: Vite und Electron gemeinsam starten

## Technik und Datenschutz

Der Renderer verwendet `contextIsolation: true` und `nodeIntegration: false`. Native Funktionen werden über eine eingeschränkte Preload-IPC-API bereitgestellt. Die Konvertierung erfolgt lokal. Internet wird nur für die erste npm-Installation benötigt.

## Credits

**Ersteller / Autor:** B&B Coder  
**Projekt:** File Converter Pro (FCP)
