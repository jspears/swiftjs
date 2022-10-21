import Parser from "web-tree-sitter";

let _parser: Parser;
let _parserPromise:Promise<Parser>;
const wasm = `${__dirname}/../wasm/tree-sitter-swift.wasm`;

async function _loadParser() {
    console.log('parser initt');
    try {
        await Parser.init();
    } catch (e) {
        console.trace(e);
        throw e;
    }
    _parser = new Parser();
    console.log('loading', wasm);
    const Swift = await Parser.Language.load(wasm);
    _parser.setLanguage(Swift);     
    return _parser;
}

export async function getParser():Promise<Parser> {
    if (_parser) {
        return _parser;
    }
    if (!_parserPromise) {
        _parserPromise = _loadParser();
    }
    return _parserPromise;
}
