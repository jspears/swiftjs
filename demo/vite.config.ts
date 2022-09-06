import { defineConfig } from 'vite'
import { readdirSync, writeFileSync, existsSync } from 'fs'

//@ts-ignore
const dirname = __dirname;

const writeHtml = (name:string, 
  content: string = `<h2>TSwift: ${name}</h2>
  <div id='wrapper'>
  <div id='page-nav'>
  <a class='full' target="_parent" href="./${name}.html">fullpage</a>
  <a class='back' href="./index.html">&lt; back</a>
  </div>
  <div id="phone"><div id="app"></div><button id='button'/></div>
  </div>
  <script type="module" src="./${name}.ts"></script>
  
  `, run = `import {App} from "../src/pages/${name}/index";
  import {run} from "../src/run";
  run(new App);`,
  )=>{
  const html = `${dirname}/public/${name}.html`;
  writeFileSync(html, `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="stylesheet" type="text/css" href="../src/style.css"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TSwift: ${name}</title>
    </head>
    <body class=${name}>
      ${content}
    </body>
  </html>`, {encoding:'utf-8'});

  if (run){
    writeFileSync(html.replace(/\.html$/, '.ts'), run);
  }

    return html;
}

const input  = 
  readdirSync(`${dirname}/src/pages`).filter(v=>existsSync(`${dirname}/src/pages/${v}/index.ts`)).reduce((ret, file)=>{
    const name = file.replace(/\.ts$/,'');
    ret[name] = writeHtml(name);
    return ret;
  }, {});

input['default'] = writeHtml('default', `
<h2> Select a demo from the left</h2>
 
`); 
input['index'] = writeHtml('index', `<ul>
<li><h2>TSwift Demos</h2></li>
${
  Object.keys(input).map(v=>`<li><a target="center" href="./${v}.html">${v}</a></li>`).join('')}
  </ul>
  <iframe src="default.html" name="center" width='100%'>

  </iframe>
  
  `
,'');
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
    outDir:`${dirname}/dist`,  
    rollupOptions: {
      
      input
    }
  }
})