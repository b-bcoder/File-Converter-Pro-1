# File Converter Pro (FCP)

File Converter Pro is een Windows-desktopapp waarmee je afbeeldingen, video, audio en PDF-bestanden lokaal converteert. Bestanden worden niet geüpload naar een online dienst.

## Maker

**Author:** B&B Coder  
**Project:** FCP (File Converter Pro)

## Functies

- Afbeeldingen converteren naar JPG, PNG, WEBP, HEIC, AVIF, PDF, ICO en SVG
- Video converteren naar MP4, WEBM, WMV en MKV
- Audio converteren naar MP3, WAV, FLAC en OGG
- PDF-bestanden naar tekst converteren
- Meerdere afbeeldingen combineren tot één PDF
- Bestanden en mappen tegelijk verwerken
- Resolutie aanpassen
- Resultaten als ZIP downloaden
- ZIP beveiligen met AES-256-wachtwoord
- Meertalige interface en eerste-start uitleg
- Donkere en lichte weergave
- Borderless fullscreen met `F11`
- Dedicated-GPU-detectie en native FFmpeg in Electron

## Installeren

1. Open de map `release`.
2. Start `File Converter Pro Setup 0.0.3.exe`.
3. Volg de Windows-installatiestappen.
4. Start de app via het Startmenu of de snelkoppeling.

Gebruik de volledige `.exe`. Een `.blockmap` en `.__uninstaller.exe` zijn geen installatiebestanden.
Na de installatie maakt Windows een snelkoppeling op het bureaublad aan. De app start standaard automatisch in borderless fullscreen. De geïnstalleerde bestanden staan lokaal in `%LOCALAPPDATA%\Programs\bestandsconverter`.

## Gebruiken

1. Voeg bestanden toe met `Browse Files` of een map met `Browse Folder`.
2. Je kunt bestanden ook naar het venster slepen.
3. Kies per bestand het uitvoerformaat en eventueel een resolutie.
4. Gebruik bij meerdere bestanden de bulkacties.
5. Kies `Convert All`.
6. Download de resultaten afzonderlijk of als ZIP.

Gebruik voor de beste kwaliteit een niet-beschadigd bronbestand, een passend formaat en een geschikte resolutie. Grote mediabestanden kunnen langer duren.

## GPU-acceleratie

De app controleert bij het opstarten de videokaart. Bij alleen een geïntegreerde GPU wordt Electron-hardwareacceleratie uitgeschakeld. Bij een dedicated GPU blijft deze ingeschakeld. NVIDIA kan `h264_nvenc` gebruiken en AMD `h264_amf` voor bepaalde video-uitvoerformaten. Audio blijft native via FFmpeg verwerken.

## Sneltoetsen

- `F11`: fullscreen aan of uit

De Electron-menubalk is verborgen. De app start standaard borderless fullscreen.

## Eerste start

Bij de eerste start kiest de gebruiker een taal. Daarna verschijnt een korte uitleg in de gekozen taal. De keuze wordt lokaal opgeslagen en de onboarding verschijnt niet opnieuw.

## Development

Vereist: Windows 10 of nieuwer, Node.js 18 of nieuwer en npm.

```powershell
npm install
npm rebuild ffmpeg-static --foreground-scripts
npm run dev
```

Andere commando's:

```powershell
npm run lint
npm run build
npm run dist
```

De installer wordt gemaakt in `release/File Converter Pro Setup <versie>.exe`.

## Libraries

- React en React DOM: gebruikersinterface
- TypeScript en Vite: development en build
- Electron: desktopruntime
- electron-builder: Windows-installer
- FFmpeg en `ffmpeg-static`: video- en audioconversie
- PDF.js en jsPDF: PDF lezen en maken
- libheif-js: HEIC/AVIF
- ImageTracerJS: SVG-conversie
- zip.js: ZIP en AES-256
- Tailwind CSS, PostCSS en Autoprefixer: styling
- `concurrently`: Vite en Electron tegelijk starten

## Techniek en privacy

De renderer gebruikt `contextIsolation: true` en `nodeIntegration: false`. Native functies lopen via de beperkte preload-IPC-API. Conversies worden lokaal uitgevoerd. Internet is alleen nodig voor de eerste npm-installatie.

## Credits

**Maker / Author:** B&B Coder  
**Project:** File Converter Pro (FCP)
