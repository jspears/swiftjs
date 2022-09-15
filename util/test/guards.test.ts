import { expect } from "chai"
import { isInstanceOf, isKeyOf, swifty } from "../src"

describe('guards', function(){
    it('isInstanceOf', function(){
        class A {};
        class B extends A {};
        class NotA {};
        const D = swifty(A);
        const E = swifty(B);
        expect(isInstanceOf(new B, A)).to.be.true;
        expect(isInstanceOf(new A, A)).to.be.true;
        expect(isInstanceOf(new NotA, A)).to.be.false;
        expect(isInstanceOf(D(), A)).to.be.true;
        expect(isInstanceOf(E(), A)).to.be.true;
        expect(isInstanceOf(E(), B)).to.be.true;
    });

    it('isKeyOf', function(){
        class Test {
            static foo = new Test();
            static bar = new Test();
        }
        class BTest extends Test {

            static huh = new BTest();
        };

        expect(isKeyOf('.foo', Test)).to.be.true;
        expect(isKeyOf('.bob', Test)).to.be.false;
        expect(isKeyOf('.foo', BTest)).to.be.false;
        
    });
})