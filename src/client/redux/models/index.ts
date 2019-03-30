import { init, Model } from "@rematch/core";
import { sessionModel as session } from "./session";

type RemoveFirstArg<T> = {
    [key in keyof T]: T[key] extends (...args: any[]) => any
        ? (...args: [Parameters<T[key]>[1]]) => ReturnType<T[key]>
        : T[key]
};
type StorefromModel<M extends Partial<Model>> = M["state"] & RemoveFirstArg<M["reducers"]>;

export interface IStore {
    session: StorefromModel<typeof session>;
}

const models = { session };
export const store = init({ models });
