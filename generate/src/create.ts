import { KindEnum, ReferenceType } from './types';
import { Project, ProjectOptions } from 'ts-morph';
import { ModuleKind, ScriptTarget } from 'typescript';
import { write } from 'fs';
import { text } from 'stream/consumers';

export function has<T, K>(v: unknown, k: PropertyKey): k is keyof T {
  return Object.prototype.hasOwnProperty.call(v, k);
}
// fetch("https://developer.apple.com/tutorials/data/documentation/corefoundation/cgfloat.json", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://developer.apple.com/documentation/swiftui/shape/trim(from:to:)",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include"
// });

/**
 *
 * @returns
 */
export const createProject = (
  tsConfigFilePath = `${__dirname}/../out/project`,
  options:ProjectOptions ={ compilerOptions:{}}
) =>
  new Project({
    ...options,
    compilerOptions:{
      ...options?.compilerOptions,
      rootDir:tsConfigFilePath,
    }
  });




export const isClosure = (v: string) =>{
  const [_, parameters='', returnType=''] = /^\(\s*(.*)\s*\)\s*->\s*(.+?)$/.exec(v) || [];
  if (!returnType){
    return;
  }
  return {
    parameters,
    returnType
  }
}

export function split(v?: string | undefined, pat = /\s*,\s*/): [string] | string[] {
  if (!v) {
    return [];
  }
  return v.split(pat).filter(Boolean);
}
export  function trim(v: string) {
  return v?.trim();
}
