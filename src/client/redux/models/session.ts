import { IAsyncStore, AsyncStoreState } from "./utils";
import { ICredentials } from "../../../lib/types/api";
import { Mutator } from "../../lib/types/utils";
import { mutate } from "../../lib/utils";

export interface ISessionStore {
    session: ISessionIdStore;
    credentials: ISessionCredentials;
}

export interface ISessionIdStore extends IAsyncStore {
    sessionId?: string;
}

export interface ISessionCredentials extends Partial<ICredentials> {}

const state: ISessionStore = {
    session: {
        state: AsyncStoreState.Unknown
    },
    credentials: {}
};

export const sessionModel = {
    state,
    reducers: {
        modifySessionId: (store: ISessionStore, mutator: Mutator<ISessionIdStore>) => {
            return mutate(store, x => mutator(x.session));
        },
        modifyCredentials: (store: ISessionStore, mutator: Mutator<ISessionCredentials>) => {
            return mutate(store, x => mutator(x.credentials));
        }
    }
};
