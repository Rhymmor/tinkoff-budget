import { observable } from "mobx";
import { LoginLevel } from "../../lib/types/login";
import { isOk } from "../../../lib/utils";
import { ApiSessionUtils, ApiLoginUtils } from "../../lib/api/login";
import { IApiCommonQuery } from "../../../lib/types/rest/tinkoff/common";
import { setRequestMiddleware } from "../../lib/api/request";
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

            this.sessionId = session;
            this.asyncStore.setSuccess();
        } catch (e) {
            setRequestMiddleware(undefined);
            this.sessionId = undefined;
            this.asyncStore.setFailed(e);
        }
    }

    public signUp = async () => {
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
    };

    public confirmSignUp = async (smsPin: string) => {
        if (!this.operationalTicket) {
            return this.asyncStore.setFailed("No operational ticket. Try sign up again");
        }
        try {
            await ApiLoginUtils.confirm(smsPin, this.operationalTicket);
            this.asyncStore.setSuccess();
            this.level = LoginLevel.User;
        } catch (e) {
            this.asyncStore.setFailed(e);
        }
    };
}
