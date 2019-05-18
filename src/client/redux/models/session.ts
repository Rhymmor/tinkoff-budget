import { IAsyncStore, AsyncStoreState } from "./utils";
import { ICredentials } from "../../../lib/types/api";
import { Mutator } from "../../lib/types/utils";
import { mutate } from "../../lib/utils";
import { ApiSessionUtils } from "../../lib/api/login";
import { logger } from "../../lib/logger";
import { setRequestMiddleware } from "../../lib/api/request";
import { IApiCommonQuery } from "../../../lib/types/rest/tinkoff/common";
import { isOk } from "../../../lib/utils";
import { LoginLevel } from "../../lib/types/login";
import { IRootState } from "../store";
import { RematchDispatch } from "@rematch/core";

export interface ISessionStore {
    session: ISessionIdStore;
    credentials: ISessionCredentials;
}

export interface ISessionIdStore extends IAsyncStore {
    sessionId?: string;
    level: LoginLevel;
}

export interface ISessionCredentials extends Partial<ICredentials> {}

const state: ISessionStore = {
    session: {
        state: AsyncStoreState.Unknown,
        level: LoginLevel.Anon
    },
    credentials: {}
};

export const sessionModel = {
    state,
    reducers: {
        modifySession: (store: ISessionStore, mutator: Mutator<ISessionIdStore>) => {
            return mutate(store, x => mutator(x.session));
        },
        modifyCredentials: (store: ISessionStore, mutator: Mutator<ISessionCredentials>) => {
            return mutate(store, x => mutator(x.credentials));
        }
    },
    effects: (dispatch: RematchDispatch<void>) => ({
        initSession: (force = false, rootStore?: IRootState) => {
            if (!force && rootStore && isOk(rootStore.session.session.sessionId)) {
                return Promise.resolve();
            }

            dispatch.session.modifySession((store: ISessionIdStore) => {
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
                    return dispatch.session.modifySession((store: ISessionIdStore) => {
                        store.sessionId = session;
                        store.state = AsyncStoreState.Success;
                        store.error = undefined;
                    });
                })
                .catch(e => {
                    logger.error(e);
                    setRequestMiddleware(undefined);
                    return dispatch.session.modifySession((store: ISessionIdStore) => {
                        store.sessionId = undefined;
                        store.state = AsyncStoreState.Failed;
                        store.error = String(e);
                    });
                });
        }
    })
};
