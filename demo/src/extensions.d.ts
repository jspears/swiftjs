/// <reference types="vite-plugin-virtual-plain-text/virtual-assets" />

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.swift' {
  const value: string;
  export = value;
}
declare module '*?raw' {
  const value: string;
  export = value;
}
