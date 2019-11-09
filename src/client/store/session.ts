import { observable, action } from "mobx";
import { AsyncStoreState, IAsyncStore } from "./utils";
import { LoginLevel } from "../lib/types/login";
import { isOk } from "../../lib/utils";
import { ApiSessionUtils, ApiLoginUtils } from "../lib/api/login";
import { IApiCommonQuery } from "../../lib/types/rest/tinkoff/common";
import { setRequestMiddleware } from "../lib/api/request";
import { logger } from "../lib/logger";
import { ICredentials } from "../../lib/types/api";
import { injectable } from "inversify";

interface ISessionStore {
    session: ISessionIdStore;
    credentials: ISessionCredentials;
}

interface ISessionIdStore extends IAsyncStore {
    sessionId?: string;
    level: LoginLevel;
}

interface ITicketStore extends IAsyncStore {
    operationalTicket?: string;
}

interface ISessionCredentials extends Partial<ICredentials> {}

@injectable()
export class SessionStore implements ISessionStore {
    @observable public session: ISessionIdStore = {
        sessionId: undefined,
        state: AsyncStoreState.Unknown,
        level: LoginLevel.Anon,
        error: undefined
    };

    @observable public ticket: ITicketStore = {
        error: undefined,
        state: AsyncStoreState.Unknown,
        operationalTicket: undefined
    };

    @observable public credentials: ISessionCredentials = {};

    public setLevel(level: LoginLevel) {
        this.session.level = level;
    }

    @action
    public async init(force = false) {
        if (!force && isOk(this.session.sessionId)) {
            return;
        }

        try {
            this.session.state = AsyncStoreState.Loading;
            const {
                data: { session }
            } = await ApiSessionUtils.getSession();
            const sessionQuery: IApiCommonQuery = { session };
            setRequestMiddleware(cfg => {
                cfg.params = { ...cfg.params, ...sessionQuery };
                return cfg;
            });
            this.setSessionId(session);
        } catch (e) {
            logger.error(e);
            setRequestMiddleware(undefined);
            this.setSessionError(e);
        }
    }

    @action
    public async signUp() {
        try {
            const { username, password } = this.credentials;
            if (!isOk(username) || !isOk(password)) {
                throw new Error("No creds");
            }

            this.ticket.state = AsyncStoreState.Loading;
            const { data } = await ApiLoginUtils.signUp(username, password);

            this.setLevel(LoginLevel.Candidate);
            this.ticket.operationalTicket = data.operationalTicket;
            this.ticket.state = AsyncStoreState.Success;
            this.ticket.error = undefined;
        } catch (e) {
            this.session.state = AsyncStoreState.Failed;
            this.session.error = String(e);
        }
    }

    private setSessionId(id: string) {
        this.session.sessionId = id;
        this.session.state = AsyncStoreState.Success;
        this.session.error = undefined;
    }

    private setSessionError(error: any) {
        this.session.sessionId = undefined;
        this.session.state = AsyncStoreState.Failed;
        this.session.error = String(error);
    }
}
