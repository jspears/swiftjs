import {OverloadedConstructorParameters, OverloadedInstanceType, swiftyKey} from '@tswift/util';
import { expect } from 'chai';

describe('swiftyFor',function(){

    it('should find key', function(){
        class TestClass {
            static foo = new TestClass();
            static bar = new TestClass();
        }
        const Test = swiftyKey(TestClass);
        
        expect(Test.fromKey('.foo')).eq(TestClass.foo);
        
        expect(Test.fromKey('.not')).eq(undefined);
        expect(Test.fromKey(undefined)).eq(undefined);
        
    });

    it('should return val', function(){
        class TestClass {
            static foo = new TestClass();
            static bar = new TestClass();
        }
        const Test = swiftyKey(TestClass);
        expect(Test.fromKey(TestClass.foo)).eq(TestClass.foo);
    });
    it('should work with overloads', function(){
        class TestClass {
            a?:string;
            b?:number;
            strs:string[];
            static foo = new TestClass(1);
            static bar = new TestClass('a');
            //constructor overloading is borked.
            constructor(a:number);
            constructor(a:string, ...rest:string[]);
            constructor(a:number|string, ...rest:string[]){
                    if (typeof a ==='string'){
                        this.a = a;
                    }else{
                        this.b = a;
                    }
                    this.strs = rest;
            }
        }
    
        const Test = swiftyKey(TestClass);
        const a = Test('a');
        expect(a.a).to.eq('a');
        const b = Test(1);
        expect(b.b).to.eq(1);

       const c = Test({a:1});

    });
});