import { defineConfig } from 'vite'
//@ts-ignore
const dirname = __dirname;

export default defineConfig({
  resolve:{
    alias:{
      'swiftjs/CoreData':`${dirname}/../src/CoreData/index.ts`,
      'swiftjs':`${dirname}/../src/index.ts`,
    }
  }
  // ...
})