import { IAsyncStore, AsyncStoreState } from "./utils";
import { ICredentials } from "../../../lib/types/api";
import { Mutator } from "../../lib/types/utils";
import { mutate } from "../../lib/utils";
import { ApiSessionUtils } from "../../lib/api/login";
import { IStore } from ".";
import { logger } from "../../lib/logger";
import { setRequestMiddleware } from "../../lib/api/request";
import { IApiCommonQuery } from "../../../lib/types/rest/tinkoff/common";

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
        initSession: (_force = false) => {
            dispatch.session.modifySessionId((store: ISessionIdStore) => {
                store.state = AsyncStoreState.Loading;
            });
            return ApiSessionUtils.getSession()
                .then(res => {
                    const { session } = res.data;
                    const sessionQuery: IApiCommonQuery = { session };
                    setRequestMiddleware(cfg => {
                        cfg.params = { ...cfg.params, ...sessionQuery };
                        return cfg;
                    });
                    return dispatch.session.modifySessionId((store: ISessionIdStore) => {
                        store.sessionId = session;
                        store.state = AsyncStoreState.Success;
                        store.error = undefined;
                    });
                })
                .catch(e => {
                    logger.error(e);
                    setRequestMiddleware(undefined);
                    return dispatch.session.modifySessionId((store: ISessionIdStore) => {
                        store.sessionId = undefined;
                        store.state = AsyncStoreState.Failed;
                        store.error = String(e);
                    });
                });
        }
    })
};
