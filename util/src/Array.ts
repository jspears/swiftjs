import { isFunction, isIterable, isObjectWithProp, isObjectWithPropType } from "./guards";
import { Range } from "./types";

interface Predicate<S> {
    (v:S):boolean;
}

class SwiftArray<S> extends Array<S> {

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
    remove(at:number){
        this.splice(at,1);
    }
    removeFirst(num = 0){
        this.splice(0, num);
    }
    removeLast(num:number=1){
        const ret = this.splice(this.length - num)
        return ret[ret.length -1];
    }
    removeSubrange(range:Range){
        this.splice(range.from, range.to-range.from)
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
        return this.pop();
    }
}
