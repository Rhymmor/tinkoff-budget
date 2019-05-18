import { init, Model } from "@rematch/core";
import * as models from "./models";
import { ISessionStore } from "./models/session";

type Func = (...args: any[]) => any;

type GetEffects<M extends Partial<Model>> = M["effects"] extends Func ? ReturnType<M["effects"]> : never;

type RemoveFirstArg<T> = {
    [key in keyof T]: T[key] extends Func ? (...args: [Parameters<T[key]>[1]]) => ReturnType<T[key]> : T[key]
};
type StorefromModel<M extends Partial<Model>> = M["state"] & RemoveFirstArg<M["reducers"]> & GetEffects<M>;

export const store = init({ models });

export interface IStore {
    session: StorefromModel<typeof models.session>;
}

export interface IRootState {
    session: ISessionStore;
}
