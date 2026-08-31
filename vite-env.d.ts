/// <reference types="vite/client" />

declare module '*.mjs?url' {
  const url: string;
  export default url;
}

declare module '*?url' {
  const url: string;
  export default url;
}

declare module 'imagetracerjs' {
  interface ImageTracerApi {
    imageToSVG(
      imageData: string,
      callback: (svg: string) => void,
      options?: string | Record<string, unknown>
    ): void;
  }

  const ImageTracer: ImageTracerApi;
  export default ImageTracer;
}

declare global {
  interface Window {
    electronAPI: {
      getFfmpegPath: () => Promise<string>;
      getGpuInfo: () => Promise<{ hasDedicatedGpu: boolean; vendor: string; name: string; encoder: string | null }>;
      cancelConversion: () => Promise<boolean>;
      getWallpaper: () => Promise<{ enabled: boolean; path: string | null; dataUrl: string | null }>;
      chooseWallpaper: () => Promise<{ enabled: boolean; path: string | null; dataUrl: string | null }>;
      disableWallpaper: () => Promise<{ enabled: boolean; path: string | null; dataUrl: string | null }>;
      getFilePath: (file: File) => string;
      convertMedia: (fileData: ArrayBuffer | string, fileName: string, targetFormat: string, targetDimensions?: { width: number; height: number }) => Promise<ArrayBuffer>;
      transcribeAudio: (fileData: ArrayBuffer, fileName: string, targetFormat: string) => Promise<string>;
      onTranscriptionProgress: (callback: (progress: number) => void) => () => void;
      readFile: (filePath: string) => Promise<ArrayBuffer>;
      writeFile: (filePath: string, data: ArrayBuffer) => Promise<boolean>;
      saveFile: (options: any) => Promise<string | null>;
    };
  }
}
