import { parseStr, toStringLit } from '../src/parseStr';
import { same } from 'tap';
describe('parseStr', function () {
    
    it('should parse simple string', function () {
        const resp =parseStr(`abc`);
        console.log(resp);
        same(resp, {
            values: ['abc'],
            literals:[]
        })
    })
})