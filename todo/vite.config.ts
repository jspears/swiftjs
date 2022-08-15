import { defineConfig } from 'vite'
//@ts-ignore
const dirname = __dirname;

export default defineConfig({
  resolve:{
    alias:{
      '@jswift/CoreData':`${dirname}/../src/CoreData/index.ts`,
      '@jswift/ui':`${dirname}/../src/index.ts`,
    }
  }
  // ...
})