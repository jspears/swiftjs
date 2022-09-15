import { isInstanceOf } from "./guards";
import { Constructor, Dot, OverloadedConstructorParameters } from "./types";

// type Factory<
// A extends Constructor,
// Args extends any[] = OverloadedConstructorParameters<A>[number]
// > = A & ((...args:OverloadedConstructorParameters<A>[number])=>InstanceType<A>)

export function swifty<
  A extends Constructor,
>(clazz: A) {
  //@ts-ignore
  return Object.setPrototypeOf((...args: OverloadedConstructorParameters<A>[number]) => new clazz(...args), clazz);
}

type KeyDot<A extends Constructor> = undefined | Dot<Exclude<keyof A, 'prototype'>> | InstanceType<A>;
type KeyRet<A extends Constructor, K> = K extends undefined ? undefined : K extends string ?
     K extends `.${infer Key extends keyof A & string}` ? A[Key] : never : 
     InstanceType<A>;

     type FactoryKey<
A extends Constructor
> =  ReturnType<typeof swifty<A>> & {
  fromKey<K extends KeyDot<A>>(k:K):KeyRet<A,K>
};

export function swiftyKey<
  A extends Constructor,
  >(clazz: A) {
  return Object.assign(swifty<A>(clazz),
  {
    fromKey<K extends KeyDot<A>>(key:K):KeyRet<A,K>{
      if (isInstanceOf(key, clazz)){
        return key as any;
      }
      if (typeof key === 'string'){
        return clazz[(key as string).slice(1) as keyof A] as any;
      }
      return undefined as any;
    }
  });
}
