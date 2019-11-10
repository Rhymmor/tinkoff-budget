import { observable } from "mobx";
import { LoginLevel } from "../../lib/types/login";
import { isOk } from "../../../lib/utils";
import { ApiSessionUtils, ApiLoginUtils } from "../../lib/api/login";
import { IApiCommonQuery } from "../../../lib/types/rest/tinkoff/common";
import { setRequestMiddleware } from "../../lib/api/request";
import { logger } from "../../lib/logger";
import { ICredentials } from "../../../lib/types/api";
import { injectable } from "inversify";
import { AsyncStateStore } from "./async-state";

interface ISessionCredentials extends Partial<ICredentials> {}

@injectable()
export class SessionStore {
    @observable public asyncStore: AsyncStateStore = new AsyncStateStore();

    @observable public level: LoginLevel = LoginLevel.Anon;
    @observable public sessionId?: string;
    @observable public operationalTicket?: string;

    @observable public credentials: ISessionCredentials = {};

    public async init(force = false) {
        if (!force && isOk(this.sessionId)) {
            return;
        }

        try {
            this.asyncStore.setPending();
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
            this.asyncStore.setPending();
            this.setSessionError(e);
        }
    }

    public async signUp() {
        try {
            const { username, password } = this.credentials;
            if (!isOk(username) || !isOk(password)) {
                throw new Error("No creds");
            }

            this.asyncStore.setPending();
            const { data } = await ApiLoginUtils.signUp(username, password);

            this.level = LoginLevel.Candidate;
            this.operationalTicket = data.operationalTicket;
            this.asyncStore.setSuccess();
        } catch (e) {
            this.asyncStore.setFailed(e);
        }
    }

    private setSessionId(id: string) {
        this.sessionId = id;
        this.asyncStore.setSuccess();
    }

    private setSessionError(error: any) {
        this.sessionId = undefined;
        this.asyncStore.setFailed(error);
    }
}
