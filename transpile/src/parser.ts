import Parser from "web-tree-sitter";

export const ParserConfig: { swift: string, ['tree-sitter']?: string } = {
    swift: `../wasm/tree-sitter-swift.wasm`,
}

let _parser: Parser;
let _parserPromise: Promise<Parser>;

async function _loadParser() {
    try {
        await Parser.init({
            locateFile(scriptName: string, scriptDirectory: string) {
                const name = scriptName.replace(/\.wasm$/, '') as keyof typeof ParserConfig;
                if (name in ParserConfig) {
                    return ParserConfig[name];
                }
                return `${scriptDirectory}/${scriptName}`;
            },
        });

    } catch (e) {
        console.trace(e);
        throw e;
    }
    _parser = new Parser();
    _parser.setLanguage( await Parser.Language.load(ParserConfig.swift));
    return _parser;
}

export async function getParser(): Promise<Parser> {
    if (_parser) {
        return _parser;
    }
    if (!_parserPromise) {
        _parserPromise = _loadParser();
    }
    return _parserPromise;
}
