import { init, Model } from "@rematch/core";
import { sessionModel as session } from "./session";

type Func = (...args: any[]) => any;

type GetEffects<M extends Partial<Model>> = M["effects"] extends Func ? ReturnType<M["effects"]> : never;

// type Func<M extends Partial<Model>> = GetFunctions<M["effects"]>;

type RemoveFirstArg<T> = {
    [key in keyof T]: T[key] extends Func ? (...args: [Parameters<T[key]>[1]]) => ReturnType<T[key]> : T[key]
};
type StorefromModel<M extends Partial<Model>> = M["state"] & RemoveFirstArg<M["reducers"]> & GetEffects<M>;

export interface IStore {
    session: StorefromModel<typeof session>;
}

const models = { session };
export const store = init({ models });

export type Store = typeof store;

// export type IStoreDispatch = typeof store.dispatch;
