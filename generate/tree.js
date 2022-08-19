const Parser = require("tree-sitter");
const Swift = require("tree-sitter-swift");

const parser = new Parser();
parser.setLanguage(Swift);

const sourceCode = `
struct HelloWorld {
    func insert(AccessibilityTraits) -> (inserted: Bool, memberAfterInsert: AccessibilityTraits) {
        print("Hello, world!")
    }
}
`;

const tree = parser.parse(sourceCode);

console.log(tree.rootNode.toString());
