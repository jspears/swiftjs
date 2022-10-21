import { isFunction, isIterable, isObjectWithProp, isObjectWithPropType } from "./guards";
import { operator } from "./operator";
import { Predicate, Compare, Range } from "./types";
import { range } from './stride';

type SortBy<S> =  Compare<S> | boolean;

// interface SwiftArrayI<T> {
//     readonly first: T;
//     readonly last: T;
//     readonly isEmpty: boolean;
//     readonly capacity: number;
//     readonly count: number;
//     remove(at: number): T;
//     sorted(by: SortBy<T> | { by: Compare<T> | boolean }): T[];
// }

abstract class SwiftArray<S> implements Iterable<S> {
    [index:number]:S;
    length:number = 0;
    abstract slice:Array<S>['slice'];
    abstract push:Array<S>['push'];
    abstract splice:Array<S>['splice'];
    abstract findIndex:Array<S>['findIndex'];
    abstract includes:Array<S>['includes'];
    abstract pop:Array<S>['pop'];
    abstract [Symbol.iterator](): Iterator<S,any,undefined> ;
   
    get first(){
        return this[0];
    }
    get last() {
        return this[this.length - 1];
    }
    get isEmpty(){
        return this.length == 0;
    }
    get count() {
        return this.length;
    }
    capacity = Number.MAX_SAFE_INTEGER;
    sorted(sort: SortBy<S> | { by: SortBy<S> } = operator('>') ): S[] {
        
        const sortBy = isObjectWithProp(sort, 'by') ? sort.by : sort;

        return this.slice().sort(typeof sortBy === 'boolean' ? operator(sortBy ? '>' : '<') : sortBy as any);
    }

    randomElement(): S {
        return this[Math.floor((Math.random()*this.length))];   
    }
    append(v: S|Iterable<S>) {
        if (isIterable(v)){
            this.push(...v);
        }else{
            this.push(v);
        }
    }
    replaceSubrange(subrange:Range, newElements:Iterable<S>){
        this.splice(subrange.from, subrange.to - subrange.from, ...newElements);
    }
    contains(element:S|Predicate<S>){
        if (isFunction(element)){
           return this.findIndex(element) > -1;
        }
        return this.includes(element);
    }
    allSatisfy(v:Predicate<S>){
        for(let j of this){
            if (!v(j)){
                return false;
            }
        }
        return true;
    }
   
    removeFirst(num = 0){
        return this.splice(0, num)[0];
    }
    removeLast(num:number=1){
        return this.splice(this.length - num).pop() as any;
    }
    removeSubrange(range:Range){
        this.splice(range.from, range.to-range.from)
    }
    remove(_: number) {
        return this.splice(_, 1)[0];
    }
    removeAll(shouldBeremoved:boolean | ((v:S)=>boolean) = true){
        //it removes all by default or if true or false, cause that's why.  see swift.
        if (typeof shouldBeremoved == 'boolean'){
            this.length = 0;
        }else{
            for(let i=0;i<this.length;i++){
                if (shouldBeremoved(this[i])){
                    this.remove(i);
                }
            }
        }
    }
    popLast():S|undefined{
        return this.pop();
    }
    range(r:{ from: number, to: number, inclusive: boolean }):S[] {
        return Array.from(range.call(this, r)) as S[];
    }
}

export type SwiftArrayT<T, Arr= InstanceType<typeof SwiftArray<T>>> = { 
    [k in keyof  Arr]:Arr[k]
}

declare global {
    interface Array<T> extends SwiftArrayT<T> {

     }
}
Object.assign(Array.prototype, SwiftArray.prototype)