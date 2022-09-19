import { defineConfig } from 'vite'
import { readdirSync, writeFileSync, existsSync } from 'fs'

//@ts-ignore
const dirname = __dirname;

const writeHtml = (name:string, 
  content: string = `
  <div id='wrapper'>
  <div id="phone"><div id="app"></div><button id='button'></div>
  </div>
  <script type="module" src="../src/pages/${name}/${name}.ts"></script>
  `, run = '')=>{

  const html = `${dirname}/public/${name}.html`;
  writeFileSync(html, `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="stylesheet" type="text/css" href="../src/style.css"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TSwift: ${name}</title>
    </head>
    <body>
    <h2>TSwift: ${name}</h2>
    <div class='wrap'>
      <ul class='nav'>
      ${pages.map(v=>v == name ? `<li><a>${v}</a></li>` : `<li><a href='./${v}.html'>${v}</a></li>`).join('')}
      </ul>
      <div class='content'>
      ${content}
      </div>
      </div>
    </body>
  </html>`, {encoding:'utf-8'});

  if (run){
    writeFileSync(html.replace(/\.html$/, '.ts'), run);
  }
    return html;
}

const pages = readdirSync(`${dirname}/src/pages`).filter(v=>existsSync(`${dirname}/src/pages/${v}/index.ts`));
const input  = pages.reduce((ret, file,idx, arr)=>{
    const name = file.replace(/\.ts$/,'');
    ret[name] = writeHtml(name);
    return ret;
  }, {});

export default defineConfig({
  resolve:{
    alias:{
      '@tswift/coredata':`${dirname}/../coredata/src/index.ts`,
      '@tswift/util':`${dirname}/../util/src/index.ts`,
      '@tswift/ui':`${dirname}/../ui/src/index.ts`,
      "react": "preact/compat",
      "react-dom": "preact/compat"
    }

  },
  esbuild: {
    jsxInject: `import * as React from 'preact';\n`
  },
  ...(process.argv.find(v=>/^--base($|=)/.test(v)) ? {root: './public'} :{}),
  base: './',
  server: {
    cors: {
      origin:'*'
    }
  },
  preview: {
    cors: {
      origin:'*'
    }
  },
  build: {
    outDir:`${dirname}/dist`,  
    rollupOptions: {
      
      input
    }
  }
})