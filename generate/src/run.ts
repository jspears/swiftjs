import { References, SwiftDoc } from './types';
import { Generator } from './Generator';
import { readDoc } from './util';

export async function run(name: string = 'ModifiedContent') {
  if (!name) {
    console.warn('no name?');
    return;
  }
  await new Generator(readDoc).registerType(name).save();
  //  "kind": "declarations"
  // await Promise.all(doc.relationshipsSections?.filter(v => v?.type == "inheritedBy")
  //     .map({ identifiers =[] } => Promise.all(identifiers.map(v => run(urlById(v, doc))): [])

  //     ));
}
//@ts-ignore
if (require.main === module) {
  run(...process.argv.slice(2)).then(
    (v) => console.dir(v, { depth: 10 }),
    console.error
  );
}
