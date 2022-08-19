import { isClosure, split } from "./create";
import { Fragment } from "./types";

type AddType = (v:string)=>unknown;
const fixArray = (v:string)=>{
  return v?.replaceAll(/\[([^\]]*)\]/g, '$1[]');
}

export class Params {

    private params:ParamInfo[];
    private nextName(){
       const current = this.count++;
       let ret = '_';
       for(let i=0; i<current;i++){
            ret += '_';
       }
       return ret;
    }
    constructor(parameter:string, public addType:AddType, private count = 0){
        const splitParams = split(parameter);
      this.params =  splitParams.map(v=>{
          let [name = '', type ] =  split(v, /\s*:\s*/) as [string, Closure];
          let hasQuestionToken = false;
           if (!type){
            type = name;
            name = this.nextName();
           }  
           //argumentLabel, parameterName
           name = name.split(/\s+?/).pop() || '';
           const closure = typeof type === 'string' ? isClosure(type) : undefined;
           if (closure){
            const params = new Params(closure.parameters, this.addType, this.count);
            type = new ClosureImpl(closure.returnType,[],[], params)
            //these recurse so we need to make sure the count is correct.
            this.count = params.count;
           }else{
            
            if (typeof type === 'string')
              hasQuestionToken = type.endsWith('?');
              if (hasQuestionToken){
                type = (type as string).slice(0,-1);
              }
              type = fixArray(type as string);
              type = type.replace(/^inout /, '').trim();
               this.addType(type);
           }

          return {
            name,
            hasQuestionToken,
            type
          }
      });
    }
    
    toTypes():{name:string,type:string}[]{
        return this.params.map(({name,type, hasQuestionToken})=>({
            name,
            hasQuestionToken,
            type:fixArray(type.toString()),
        }));
    }

    toString():string{
         return this.params.map(({type, hasQuestionToken, name})=>`${name}${hasQuestionToken ? '?' : ''}:${type}`).join(', ');
    }
}

export class ClosureImpl {
    public name:string = '';
    static parseMethod(
        f: Fragment[] | string = [],
        addType:AddType
      ) {
        const str = Array.isArray(f) ? f.map((v) => v.text).join('') : f;
      
        const reg =
          /(?:mutating\s)?(?:func\s)?\s*(.+?)?(?:<(.+?)>)?\(\s*(.*)\s*\)(?:\s*->\s*(?:some\s*)?(.+?)(?:<(.+?)>)?)?$/.exec(
            str
          ) || [];
        const [
          _,
          name = '',
          typeParameters = '',
          parameters = '',
          returnType = '',
          returnTypeParameters = '',
        ] = reg;

        const close = new ClosureImpl(returnType?.trim(),[],[], new Params(parameters, addType));
        close.constraint = split(typeParameters);
        close.returnTypeParameters = split(returnTypeParameters)
        close.name = name;
        return close;
        // const ret = {
        //   name,
        //   parameters: new Params(parameters, addType(v, allParmas)).toTypes(),
        //   typeParameters: typeParams,
        //   returnType: returnType?.trim(),
        //   returnTypeParameters: split(returnTypeParameters),
        // };
      
        // return ret;
      }
    constructor(
        private _returnType:string, 
        public constraint:string[]  = []   ,
        private returnTypeParameters:string[] = [],
        public params:Params){
          _returnType = (this._returnType = _returnType || 'Void');

        if (!constraint.includes(_returnType))
             params.addType(_returnType);
       returnTypeParameters.map(params.addType);     
        
    }
    
    get parameters():{name:string, type:string, constraint?:string}[]{
      return this.params.toTypes();
    }
    get body():string{
        if (this.returnType === 'this'){
            return 'return this';
        }
        return `return null`;
    }
    get returnType() {
        if (this.returnTypeParameters.length){
            return `${fixArray(this._returnType)}<${this.returnTypeParameters.join(',')}>`
        }
        return fixArray(this._returnType);
    }
   
    toString(){
        return `(${this.params})=>${this.returnType}`;
    }
}

type ParamInfo  = {
    name:string;
    type:Closure;
    constraint?:string[];
    hasQuestionToken?:boolean;
}

type Closure = {
    params:Params;
    returnType:Closure | string;
    constraint?:string[]
} | string

function parse(str:string){

  let i=0;
  let state = 'start';

  while(i<str.length){
    
  }
}