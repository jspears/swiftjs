
interface StringParts {
    literals:string[];
    values:string[];
}

export function parseStr(str:string):StringParts {

  let re = /(.+?)(?:\((.+?)\))/g;
  const ret:StringParts = {literals:[], values:[]};

  while(true) {
      const z=re.exec(str);
    if (z == null){
        break;
    }
    
    if (isStringArray(z)){
        ret.literals.push(z[1]);
        ret.values.push(z[2]);
    }
 }
 return ret;
}
export function toStringLit({literals, values}:StringParts):string {
    let ret = "`";
    for(let i=0,m=Math.max(literals.length, values.length);i<m;i++){
        if (i< literals.length ){
            ret+=literals[i];
        }
        if (i< values.length ){
            ret+=`\${${values[i]}}`
        }
    }
    return ret+'`';
}

function isStringArray(v:unknown):v is string[] {
    return Array.isArray(v);
}