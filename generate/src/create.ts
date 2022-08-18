import { KindEnum, ReferenceType, } from "./types"
import { Project } from "ts-morph";
import { ModuleKind, ScriptTarget } from "typescript";
import { write } from "fs";
import { text } from "stream/consumers";

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
export const createProject = (tsConfigFilePath = `${__dirname}/../out/project`) => new Project({
    tsConfigFilePath:`${tsConfigFilePath}/tsconfig.json`,

});

export const BUILT_IN = new Set([
    'Bool',
    'Int',
    'Optional',
    'String',
    'Float',
    'Character',
    'Double',
    'Void'
]);


const ignore = new Set(['', ',', ':'])

const fixNameType = (v:string)=>{
    let [name, type] = split(v, /\s*:\s*/);

    if (isClosure(name)){
        type = closureParse(name) || 'unknown';
        name = 'callback';
    }else if (!type) {
        type = name;
        name = '_';
    }
    if (isClosure(type)){
        type = closureParse(type) || 'unknown';
    }
    if (!(type && name)) {
        return;
    }
    return { type, name };
}
type NameType = {
    type:string;
    name:string;
}

export const isClosure = (v:string)=>/\(\s*(.+?)\s*\)=>\s*(.+?)/.exec(v);

const closureParse=(str:string)=>{
  const [_, argType='', returnType = 'unknown'] = isClosure(str) || ['',''];
  if (!_){
    return;
  }
  const parameters = split(argType).map(fixNameType).filter(Boolean) as NameType[]
  return {
    parameters,
    returnType
  }
}


export function fragToMethod(f: ReferenceType['fragments'] = [], ignore = new Set()) {
    const str = Array.isArray(f) ? f.map(v => v.text).join('') : f;

    const reg = /func\s+?(.+?)(?:<(.+?)>)?\(\s*(.*)\s*\)\s*->\s*(?:some\s*)?(.+?)(?:<(.+?)>)?$/.exec(str) || [];
    const [_, name = '',
        typeParameters = '',
        parameters = '',
        returnType = '',
        returnTypeParameters = ''
    ] = reg;
    const typeParams = split(typeParameters);
    const ret = {
        name,
        parameters: split(parameters).map(fixNameType).filter(Boolean) as TextName[],
        typeParameters: typeParams,
        returnType:returnType?.trim(),
        returnTypeParameters: split(returnTypeParameters),
        imports:f.filter(v=>v.kind === KindEnum.TypeIdentifier).filter(v=>
            !(typeParams.includes(v.text) || v.text == 'Self')),



    }

    return ret;

}
type TextName = {type:string, name:string};
function split(v?:string|undefined, pat=/\s*,\s*/):string[]{
    if (!v){
        return []
    }
    return v.split(pat).filter(Boolean);
}
function trim(v:string){
    return v?.trim();
}


