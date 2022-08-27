import { defineConfig } from 'vite'
import {readdirSync, writeFileSync} from 'fs';
//@ts-ignore
const dirname = __dirname;

const input  = 
  readdirSync(`${dirname}/src/pages`).filter(v=>/\.ts$/.test(v)).reduce((ret, file)=>{
    const name = file.replace(/\.ts$/,'');
    const html = `${dirname}/public/${name}.html`;
    writeFileSync(html, `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TSwift: ${name}</title>
      </head>
      <body>
        <div id="app"></div>
        <script type="module" src="/src/pages/${file}"></script>
      </body>
    </html>`, {encoding:'utf-8'});
    ret[name] = html;
    return ret;
  }, {});

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
        main: `${dirname}/public/index.html`,
        text: `${dirname}/public/text.html`,

      }
    }
  }
})