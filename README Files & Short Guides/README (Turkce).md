# File Converter Pro (FCP)

File Converter Pro, görüntü, video, ses ve PDF dosyalarını yerel olarak dönüştüren bir Windows masaüstü uygulamasıdır. Dosyalar çevrim içi bir servise yüklenmez.

## Geliştirici

**Yazar:** B&B Coder  
**Proje:** FCP (File Converter Pro)

## Özellikler

- Görüntüleri JPG, PNG, WEBP, HEIC, AVIF, PDF, ICO ve SVG formatlarına dönüştürme
- Videoları MP4, WEBM, WMV ve MKV formatlarına dönüştürme
- Ses dosyalarını MP3, WAV, FLAC ve OGG formatlarına dönüştürme
- PDF dosyalarından metin çıkarma
- Birden fazla görüntüyü tek PDF dosyasında birleştirme
- Dosya ve klasörleri toplu işleme
- Çıkış çözünürlüğünü değiştirme
- Sonuçları ZIP olarak indirme
- ZIP dosyalarını AES-256 parolasıyla koruma
- Çok dilli arayüz ve ilk açılış kılavuzu
- Açık ve koyu tema
- `F11` ile kenarlıksız tam ekran
- Özel GPU algılama ve Electron içinde yerel FFmpeg

## Kurulum

1. `release` klasörünü açın.
2. `File Converter Pro Setup 0.0.3.exe` dosyasını çalıştırın.
3. Windows kurulum adımlarını izleyin.
4. Uygulamayı Başlat menüsünden veya kısayoldan açın.

Tam `.exe` yükleyicisini kullanın. `.blockmap` ve `.__uninstaller.exe` dosyaları yükleyici değildir.
Kurulumdan sonra Windows masaüstünde bir kısayol oluşturur. Uygulama varsayılan olarak kenarlıksız tam ekran modunda otomatik olarak başlar. Yüklü dosyalar yerel olarak `%LOCALAPPDATA%\Programs\bestandsconverter` konumunda bulunur.

## Kullanım

1. `Browse Files` ile dosya veya `Browse Folder` ile klasör ekleyin.
2. Dosyaları pencereye sürükleyebilirsiniz.
3. Her dosya için çıkış formatını ve gerekirse çözünürlüğü seçin.
4. Birden fazla dosya için toplu işlemleri kullanın.
5. `Convert All` seçeneğine tıklayın.
6. Sonuçları ayrı ayrı veya ZIP olarak indirin.

En iyi sonuç için geçerli bir kaynak dosyası, uygun bir çıkış formatı ve doğru çözünürlük kullanın. Büyük medya dosyalarının işlenmesi daha uzun sürebilir.

## GPU hızlandırma

Uygulama başlangıçta video adaptörünü kontrol eder. Yalnızca tümleşik GPU algılanırsa Electron donanım hızlandırmasını kapatır. Özel GPU bulunduğunda hızlandırma açık kalır. Desteklenen video çıkışlarında NVIDIA GPU'lar `h264_nvenc`, AMD GPU'lar `h264_amf` kullanabilir. Ses yerel FFmpeg üzerinden işlenir.

## Kısayollar

- `F11`: tam ekranı aç veya kapat

Electron menü çubuğu gizlidir. Uygulama kenarlıksız tam ekran modunda başlar.

## İlk açılış

İlk açılışta bir dil seçin. Ardından kısa kullanım kılavuzu seçilen dilde gösterilir. Seçim yerel olarak kaydedilir ve kılavuz tekrar gösterilmez.

## Geliştirme

Gereksinimler: Windows 10 veya üzeri, Node.js 18 veya üzeri ve npm.

```powershell
npm install
npm rebuild ffmpeg-static --foreground-scripts
npm run dev
```

Diğer komutlar:

```powershell
npm run lint
npm run build
npm run dist
```

Yükleyici `release/File Converter Pro Setup <sürüm>.exe` konumunda oluşturulur.

## Kullanılan kütüphaneler

- React ve React DOM: kullanıcı arayüzü
- TypeScript ve Vite: geliştirme ve derleme
- Electron: masaüstü çalışma ortamı
- electron-builder: Windows yükleyicisi
- FFmpeg ve `ffmpeg-static`: video ve ses dönüştürme
- PDF.js ve jsPDF: PDF okuma ve oluşturma
- libheif-js: HEIC/AVIF desteği
- ImageTracerJS: SVG dönüştürme
- zip.js: ZIP ve AES-256 şifreleme
- Tailwind CSS, PostCSS ve Autoprefixer: stil
- `concurrently`: Vite ve Electron'u birlikte başlatma

## Teknoloji ve gizlilik

Renderer `contextIsolation: true` ve `nodeIntegration: false` kullanır. Yerel işlevler sınırlı preload IPC API üzerinden sunulur. Dönüştürme işlemleri yerel olarak yapılır. İnternet yalnızca ilk npm kurulumu sırasında gereklidir.

## Katkı ve teşekkürler

**Geliştirici / Yazar:** B&B Coder  
**Proje:** File Converter Pro (FCP)
