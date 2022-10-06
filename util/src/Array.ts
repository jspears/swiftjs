import { isFunction, isIterable } from "./guards";
import { Predicate, Compare, Range } from "./types";

interface SwiftArrayI<T> {
    readonly first: T;
    readonly last: T;
    readonly isEmpty: boolean;
    readonly capacity: number;
    readonly count: number;
    remove(at: number): T;
    sorted(by: { by: '>' | '<' | Compare<T> | boolean }): T[];
}
declare global {
    interface Array<T> extends SwiftArrayI<T> {

    }
}

export class SwiftArray<S> extends Array<S> {

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
    sorted({ by }: { by: '>' | '<' | Compare<S> | boolean } = { by: '>' }): S[] {

        let fn: undefined | ((a: S, b: S) => number);
        if (by == '<'|| by == true) {
            fn = (a:S, b:S) => (a + '').localeCompare(b+'');
        } else if (by == '>' || by == false) {
            fn = (b:S,a:S) => (a + '').localeCompare(b+'');
        } else if (typeof by === 'function') {
            fn = (a:S, b:S) => by(a, b) ? 1 : -1;
        }

        return this.slice().sort(fn);
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
    popLast(){
        return this.pop() as any;
    }
}
