# Changelog

Alle belangrijke wijzigingen aan File Converter Pro worden in dit bestand bijgehouden.

Dit project gebruikt de structuur van [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) en volgt [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned

- Verdere optimalisatie van de conversiesnelheid
- Uitbreiding van GPU-ondersteuning voor meer codecs
- Verdere verbetering van de gebruikersinterface
- Automatische updates voor de desktopapp

## [0.0.3] - 2026-08-28

### Added

- Windows Electron-desktopapplicatie met NSIS-installer
- Lokale en offline verwerking van afbeeldingen, video, audio en PDF-bestanden
- Afbeeldingsconversie naar JPG, PNG, WEBP, HEIC, AVIF, PDF, ICO en SVG
- Videoconversie naar MP4, WEBM, WMV en MKV
- Audioconversie naar MP3, WAV, FLAC en OGG
- PDF-naar-tekstconversie
- Meerdere afbeeldingen combineren tot één PDF
- Bestanden en mappen in bulk toevoegen en verwerken
- Instelbare uitvoerresoluties
- ZIP-export voor geconverteerde bestanden
- Optionele AES-256-wachtwoordbeveiliging voor ZIP-bestanden
- Meertalige interface voor Nederlands, Engels, Duits, Frans, Turks, Chinees en Japans
- Eerste-start onboarding met taalkeuze en gebruikersuitleg
- Donkere en lichte weergave
- Borderless fullscreen bij het opstarten
- `F11`-sneltoets om fullscreen aan of uit te zetten
- Eigen applicatie-icoon via `assets/icon.ico`
- Veilige Electron-preload-API met `contextIsolation` en uitgeschakelde `nodeIntegration`
- GPU-detectie voor geïntegreerde en dedicated GPU's
- Native FFmpeg-conversie binnen Electron
- NVIDIA NVENC-ondersteuning voor geschikte video-uitvoer
- AMD AMF-ondersteuning voor geschikte video-uitvoer
- Relatieve Vite-assets voor correcte werking vanuit een geïnstalleerde Electron-app
- Lokale FFmpeg-WASM-, PDF.js-, ZIP-, HEIF- en SVG-assets voor offline gebruik
- Lokale Tailwind CSS-build zonder CDN-afhankelijkheid
- Uitgebreide README-documentatie in meerdere talen

### Fixed

- Ontbrekende Electron main process-entry toegevoegd
- Ontbrekende preload-integratie toegevoegd
- Witte pagina na installatie vanuit de release-map opgelost met relatieve Vite-paden
- Foutieve Vite dependency optimization van PDF.js- en FFmpeg-workers opgelost
- `RuntimeError: memory access out of bounds` bij browser-WASM-mediaconversie omzeild door native FFmpeg in Electron te gebruiken
- `Media engine not loaded` bij audio- en videoconversie opgelost
- Ontbrekende `ffmpeg.exe` hersteld via het `ffmpeg-static` installatiescript
- Electron-menubalk verwijderd
- Foutieve verwijzing naar het ontbrekende `index.css`-bestand verwijderd en styling lokaal gekoppeld
- Fallback naar het standaard Electron-icoon opgelost
- TypeScript-declaraties toegevoegd voor `imagetracerjs` en `libheif-js`
- Installer opnieuw opgebouwd nadat een onvolledige NSIS-installer was aangemaakt

### Changed

- Electron gebruikt `ffmpeg-static` buiten `app.asar` voor native uitvoering
- Productiebuild wordt opgeslagen in `dist`
- Windows-installer wordt opgeslagen in `release`
- Electron-builder gebruikt `File Converter Pro` als productnaam
- De applicatie gebruikt versie `0.0.3`

## [0.0.2]

### Added

- Eerste Electron-installer met Windows NSIS-target
- Basisconfiguratie voor Electron-builder
- Lokale preload- en main-process-structuur

## [0.0.1]

### Added

- Eerste werkende versie van de File Converter Pro-interface
- Basisconversie voor afbeeldingen en mediabestanden
- React-, TypeScript- en Vite-projectstructuur

[Unreleased]: https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY/compare/v0.0.3...HEAD
[0.0.3]: https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY/releases/tag/v0.0.3
