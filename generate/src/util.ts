import 'isomorphic-fetch';
import { writeFile, readFile, open, unlink, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { SwiftDoc, References } from './types';
//@ts-ignore
const dirname = __dirname;
export const BUILT_IN = new Set([
  'Bool',
  'Int',
  'Optional',
  'String',
  'Float',
  'Character',
  'Double',
  'Void',
]);
export function isBuiltin(v: string) {
  return BUILT_IN.has(v);
}
export const out = (name: string) =>
  join(
    dirname,
    '..',
    'out',
    'schema',
    name.replace(/^.*\/documentation\/swiftui\//, '')
  );

export async function hasDoc(url?: string): Promise<boolean> {
  if (!url) {
    return false;
  }
  try {
    await stat(url);
    return true;
  } catch (e) {
    if ((e as { code: string })['code'] != 'ENOENT') {
      console.trace(e);
    }
  }
  return false;
}
export const rmkdir = async (dir: Parameters<typeof mkdir>[0]) => {
  if (await mkdir(dir, { recursive: true })) {
    console.log('created dir', dir);
    return true;
  }
  return false;
};
export function isString(v: unknown): v is string {
  return typeof v === 'string';
}
export const urlById = (id: keyof References, doc: SwiftDoc) => {
  return doc?.references?.[id]?.url;
};

export async function readDoc(name: string): Promise<SwiftDoc| undefined> {
  name = name
    .replace('/documentation/swiftui/', '')
    .replace(/(?:\.json)?$/, '.json');
  const outFileName = out(name);
  if (await hasDoc(outFileName)) {
    try {
      return JSON.parse(await readFile(outFileName, 'utf-8'));
    } catch (e) {
      console.trace(e);
    }
  }
  //Request URL: https://developer.apple.com/tutorials/data/documentation/swiftui/labelstyleconfiguration/icon-swift.struct.json
  await rmkdir(join(outFileName, '..'));
  const fd = await open(outFileName, 'w+');
  console.log('created file handle', outFileName);
  //https://developer.apple.com/tutorials/data/documentation/swiftui/view-layout.json
  const fullUrl = `https://developer.apple.com/tutorials/data/documentation/swiftui/${name}`;
  console.log('fetching', fullUrl);
  try {
    const json = await (
      await fetch(fullUrl, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'sec-ch-ua':
            '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        referrer: 'https://developer.apple.com/documentation/swiftui/view',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
      })
    ).json();

    await writeFile(fd, JSON.stringify(json, null, 2), 'utf-8');
    console.log('wrote', outFileName);
    return json;
  } catch (e) {
    console.warn(`error getting ${name}`);
    console.trace(e);
  } finally {
    await fd.close();
  }
}
