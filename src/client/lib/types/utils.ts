export type Mutator<T> = (obj: T) => void;
export type MutatorHelper<T> = (mutator: Mutator<T>) => void;
