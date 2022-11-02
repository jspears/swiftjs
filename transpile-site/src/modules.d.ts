declare module '*.css';
declare module '*.svg';
declare module '*?url' {
    var url: string;
    export default url;
}