import { sequence, stride, zip } from "@tswift/util"
import { expect } from "chai";


describe('zip', function(){
    it('should zip', function(){
        const loop = [];
        for(const res of zip([0,1,2], ['a', 'b', 'c'])){
                loop.push(res);
        }
        expect(loop).to.eql([[0,'a'],[1,'b'], [2,'c']]);
    });

    it('should zip of seq', function(){
        const loop:[number,string][] = [];
        for(const res of zip(stride('0..<3'), ['a', 'b', 'c'])){
                loop.push(res);
        }
        expect(loop).to.eql([[0,'a'],[1,'b'], [2,'c']]);
    })
})