
// 在這裡宣告 interface 就相當於在 ts 檔案中宣告，可以被其他 ts 檔案使用

interface ImportMetaEnv {
  VITE_API_KEY: string;
  VITE_CLIENT_ID: string;
  VITE_SCOPE: string;
  VITE_DISCOVERY_DOCS_STIRIG: string;
  VITE_GAPI_SRC: string;
  [propName: string]: any
}



// 那在宣告 decalre 代表著"補宣告型別"
// Type definitions for Google API Client
// Project: https://github.com/google/google-api-javascript-client
// Definitions by: Frank M <https://github.com/sgtfrankieboy>, grant <https://github.com/grant>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3


declare const gapi: any
// * 太麻煩了... 隨便弄個東西上去好了...

// https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift'
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
  & {
    readonly length: L 
    [ I : number ] : T
    [Symbol.iterator]: () => IterableIterator<T>   
  }
