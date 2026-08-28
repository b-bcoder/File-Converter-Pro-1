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

declare module 'libheif-js/libheif-wasm/libheif-bundle.mjs' {
  interface LibheifModule {
    Image: {
      Format: {
        HEVC: unknown;
        AVIS: unknown;
      };
    };
    Encoder: new (format: unknown) => {
      encode(
        images: Array<{ width: number; height: number; data: Uint8ClampedArray }>,
        options: { quality: number }
      ): Promise<{ heif: ArrayBuffer }>;
    };
  }

  const createLibheif: () => Promise<LibheifModule>;
  export default createLibheif;
}