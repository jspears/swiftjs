import { Transpile } from "transpile";

export async function run(files:string[]){
  const t = new Transpile();
  for(const file of files){
      console.log(`--file ${file}--`);
      const tree = (await t.transpile(file)).getText();
      console.log(tree);
    }
}

run(process.argv.slice(2)).then(console.log, console.error);