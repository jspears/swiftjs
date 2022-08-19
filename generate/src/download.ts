import { readDoc, urlById } from './util';
import { References } from './types';

const set = new Set<string>();

const download = async (url: string | undefined) => {
  if (!url) {
    return;
  }
  if (set.size != set.add(url).size) {
    const doc = await readDoc(url);
    if (!doc) {
      console.warn(`no doc for ${url}`);
      return;
    }
    const rest = doc.relationshipsSections?.filter(
      (v: { type: string }) => v?.type == 'inheritedBy'
    );
    const urls = rest
      ?.flatMap(
        ({ identifiers }) => identifiers
      )
      .map((v: string) => v && urlById(v as keyof References, doc)) as string[];
    await Promise.all(urls.map((v) => download(`${v}.json`)));
  }
};
//@ts-ignore
if (require.main === module) {
  download(process.argv.slice(2)[0]).then(
    (v) => console.dir(v, { depth: 10 }),
    console.error
  );
}
