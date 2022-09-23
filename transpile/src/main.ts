import { parseFile } from "./parser";

export async function run(files:string[]){
    for(const file of files){
      console.log(`--file ${file}--`);
      const tree = await parseFile(file);
      console.dir(tree.rootNode.toString(), {depth:15});
    }

}

run(process.argv.slice(2)).then(console.log, console.error);