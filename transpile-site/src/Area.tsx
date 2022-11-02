import {FunctionalComponent} from 'preact';
import style from './Area.module.css';
import {ts, Diagnostic } from 'ts-morph';
import { errors } from '@ts-morph/common';

export const Area:FunctionalComponent<{value:string, 
    diagnostics:Diagnostic<ts.Diagnostic>[]
    class:string}> = ({value,diagnostics = [], class:className})=>{
      const byLine =  diagnostics.reduce((ret, v)=>{
            const ln = (v.getLineNumber() ?? 1) -1;
            if (ret[ln]){
                ret[ln].push(v);
            }else{
                ret[ln] = [v];
            }
            return ret;
        }, [] as Diagnostic[][]);
        console.log(diagnostics);
    return <div class={style.container+' '+className}>
        <ol class={style.numbers}>
            {value.split('\n').map((v,i)=>(<li {...(byLine[i] ? {
                class:style.error
            } : {})}><pre title={byLine[i]?.map(v=>v.getMessageText()).join('\n')}>{v}</pre></li>))}
        </ol>
    </div>
}