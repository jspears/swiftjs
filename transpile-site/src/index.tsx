import { render, Component, createRef } from 'preact';
import { transpile } from './transpile-web';
import style from './index.module.css';
import './style.css';
import { ts, Diagnostic } from 'ts-morph';
import { Area } from './Area';

function basename(v: string) {
    return v.replace(/.*\/(.+?)\/(.+?)\.swift/, '$1/$2');
}
//@ts-ignore
const allModules = import.meta.glob(['../../demo/src/pages/**/*.swift', '../example/*.swift'], { as: 'raw' });
const mappedModules = Object.fromEntries(Array.from(Object.entries(allModules)).map(([k, v]) => [basename(k), v]));
const modules = Object.keys(mappedModules);

async function importSwift(m: string) {
    return (await mappedModules[m]());
}

class App extends Component {
    srcRef = createRef();
    state: {
        busy?: boolean,
        diagnostics?: Diagnostic<ts.Diagnostic>[],
        out: string, error?: string, selected?: string
    } = { out: '', selected: window.location.hash.replace(/^#/, '') };
    constructor() {
        super();
        if (this.state.selected)
            this.load(this.state.selected);
    }
    load = async (target: Event | string) => {
        this.busy();
        const selected = typeof target === 'string' ? target : (target.currentTarget as HTMLElement).dataset.id;

        if (selected) {
            this.setState({ selected });
            try {
                const result = await importSwift(selected);
                if (result) {
                    this.srcRef.current.value = result;
                    this.transpile();
                } else {
                    throw new Error('Error reading ' + selected);
                }
            } catch (error) {
                this.error(error ?? 'An error');
            }
        }
    }
    busy = (busy = true) => {
        this.setState({ busy });
    }
    update = ({ text: out, emit = [], preEmit = [] }: {
        text: string,
        emit: Diagnostic<ts.Diagnostic>[],
        preEmit: Diagnostic<ts.Diagnostic>[]
    }) => {
        this.setState({ out, busy: false, diagnostics: [...emit, ...preEmit].filter(Boolean) });

    }
    error = (error: string | Error | {}) => {
        this.setState({ busy:false, error: error instanceof Error ? error.message : error + '' });
    }
    transpile = () => {
        this.setState({ out: '', busy: true });
        transpile(this.srcRef.current.value).then(this.update, this.error);
    }

    render() {
        const { selected } = this.state;
        return (<>
            <h2>TSwift Transpile: {selected}</h2>
            <div class={style.content}>
                <div class={style.navigate}>
                    <ul>
                        {modules.map(key => <li key={key}>
                            {selected == key ? selected : <a onClick={this.load} data-id={key} href={`#${key}`}>{key.split('/')[1]}</a>}
                        </li>)}
                    </ul>

                </div>
                <div class={style.main}>
                    <div class={style.source}>
                        <textarea class='left' placeholder={'//Swift Source Code'} ref={this.srcRef}></textarea>
                        <Area class={style.out} diagnostics={this.state.diagnostics ?? []} value={this.state.out} />
                    </div>
                    <button disabled={this.state.busy} onClick={this.transpile}>{this.state.busy ? 'busy' : 'transpile'}</button>
                    <fieldset>
                        <legend>Diagnostics:</legend>
                        <ul>
                            {this.state.diagnostics?.map((d, i) => (<Diag key={`key${i}`} diagnostic={d} />))}
                        </ul>
                    </fieldset>
                </div>
            </div>

        </>);
    }
}
function Diag({diagnostic:d}: { diagnostic: Diagnostic<ts.Diagnostic> }) {
    return (<li class={style.diag}>
        <a href={`#ln${d.getLineNumber()}`}>{d.getLineNumber()}</a>{d.getMessageText()}
    </li>);
}
document.addEventListener('DOMContentLoaded', function () {
    console.log('init');
    const node = document.getElementById('app');
    if (!node) {
        console.warn('did not find app node');
        return;
    }
    console.log('node', node);
    render(<App />, node);
})
