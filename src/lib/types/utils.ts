export type TypeGuard<T, K extends T> = (obj: T) => obj is K;

export type All<S> = S[keyof S];

type KeysType = string | number | symbol;

export type UseStrings<K extends KeysType, T> = { [keys in K]: T };

export type UseKeys<K, T> = { [keys in keyof K]: T };

export type RemoveKeys<T, Keys> = Pick<T, Exclude<keyof T, Keys>>;
