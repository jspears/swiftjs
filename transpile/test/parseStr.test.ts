//import '../mocha';
import { parseStr, toStringLit } from '../src/parseStr';
import { same } from 'tap';
describe('parseStr', function () {
    
    it('should parse simple string', function () {
        const resp = parseStr(`abc`);
        same(resp, {
            values: [],
            literals: ['abc']
        })
    });

    it('should parse a complex string', function () {
        const resp = parseStr(`abc (in stuff)`);
        same(resp, {
            values: ['in stuff'],
            literals: ['abc ']
        })
        same('`abc ${1}`', toStringLit({...resp, values:['1']}));
    });

    it('should parse a complex value', function () {
        const resp = parseStr(`(in stuff)`);
        same(resp, {
            values: ['in stuff'],
            literals: ['']
        })
        same('`${1}`', toStringLit({...resp, values:['1']}));
    });
    it('should parse a complex value', function () {
        const resp = parseStr(`(in stuff) abc`);
        same(resp, {
            values: ['in stuff'],
            literals: ['',' abc']
        })
        same('`${1} abc`', toStringLit({...resp, values:['1']}));
    });
})