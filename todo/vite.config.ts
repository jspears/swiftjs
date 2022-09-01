import { defineConfig } from 'vite'
//@ts-ignore
const dirname = __dirname;

export default defineConfig({
  resolve:{
    alias:{
      '@tswift/coredata':`${dirname}/../coredata/src/index.ts`,
      '@tswift/util':`${dirname}/../util/src/index.ts`,
      '@tswift/ui':`${dirname}/../ui/src/index.ts`,
    }

  },
  esbuild: {
    jsxInject: `import * as React from 'preact';\n`
  },
  ...(process.argv.find(v=>/^--base($|=)/.test(v)) ? {root: './public'} :{}),
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: `${dirname}/public/index.html`
      }
    }
  }
})