import { defineConfig } from 'vite'
//@ts-ignore
const dirname = __dirname;

export default defineConfig({
  resolve:{
    alias:{
      '@jswift/CoreData':`${dirname}/../CoreData/src/index.ts`,
      '@jswift/ui':`${dirname}/../ui/src/index.ts`,
      '@jswift/util':`${dirname}/../util/src/index.ts`,
    }
  }
})