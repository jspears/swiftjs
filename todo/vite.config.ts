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
  build: {
    rollupOptions: {
      input: {
        main: `${dirname}/public/index.html`
      }
    }
  }
})