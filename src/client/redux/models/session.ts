import { IAsyncStore, AsyncStoreState } from "./utils";
import { ICredentials } from "../../../lib/types/api";
import { Mutator } from "../../lib/types/utils";
import { mutate } from "../../lib/utils";
import { ApiSessionUtils } from "../../lib/api/login";
import { IStore } from ".";
import { logger } from "../../lib/logger";

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
    },
    effects: (dispatch: any) => ({
        initSession: (_force = false, _rootState?: IStore) => {
            dispatch.session.modifySessionId((store: ISessionIdStore) => {
                store.state = AsyncStoreState.Loading;
            });
            return ApiSessionUtils.getSession()
                .then(res => {
                    return dispatch.session.modifySessionId((store: ISessionIdStore) => {
                        store.sessionId = res.data.session;
                        store.state = AsyncStoreState.Success;
                    });
                })
                .catch(e => {
                    logger.error(e);
                    return dispatch.session.modifySessionId((store: ISessionIdStore) => {
                        store.error = String(e);
                        store.state = AsyncStoreState.Failed;
                    });
                });
        }
    })
};
