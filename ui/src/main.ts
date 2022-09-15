import { View, Viewable, ViewableClass } from "./View";
import { render } from "./dom";
import { App } from "./App";

class Resolvable<T> {
    resolve(v:T):void{
        throw new Error('this should never get called');
    };
    reject(e:Error):void{
        throw new Error('this should never get called');
    }
    
    promise:Promise<T>;

    constructor(){
        const self = this;
        this.promise = new Promise<T>((resolve, reject)=>{
            self.resolve = resolve;
            self.reject = reject;
        });
    }
}

export const AppRegistry = new class {
    view = new Resolvable<ViewableClass>();
    doc = new Resolvable<HTMLElement>();
    selector:string = '#app';
    constructor(){
        Promise.all([
            this.view.promise,
            this.doc.promise
        ]).then(this.render);
        this.init();
    }
    register=(view:ViewableClass)=>{
        this.view.resolve(view);
    }
    render = ([View, appNode]:[ViewableClass, HTMLElement])=>{
        if (!appNode) {
            throw new Error('Could not find #app');
        }
        if (!View){
            throw new Error(`No view found`);
        }
        render((globalThis.__SWIFT_UI = App(new View())), appNode);
    }
    init = ()=>{
        if (document.readyState === 'complete') {
            const node = document.querySelector(this.selector);
            if (node){
                this.doc.resolve(node as HTMLElement);
            }else{
                console.warn('Document ready but node not found '+this.selector);
            }
        }else{
             document.addEventListener('readystatechange', this.init);
        }
    }
}

export function main(MainView: ViewableClass) {
    AppRegistry.register(MainView);
}
