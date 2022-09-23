import Parser from "web-tree-sitter";
import { readFile } from 'fs/promises';

let _parser: Parser;
let _parserPromise:Promise<Parser>;

async function _loadParser() {   
    await Parser.init();
    _parser = new Parser();
    const Swift =  await Parser.Language.load(`${__dirname}/../wasm/tree-sitter-swift.wasm`)
    _parser.setLanguage(Swift);     
    return _parser;
}

export async function getParser() {
    if (_parser) {
        return _parser;
    }
    if (!_parserPromise) {
        _parserPromise = _loadParser();
    }
    return _parserPromise;
}
export async function parseFile(file: string) {
    const [p, content] = await Promise.all([getParser(), readFile(file, 'utf-8')]);
    return p.parse(content);
}
