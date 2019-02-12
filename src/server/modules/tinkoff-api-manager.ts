import {TinkoffApi, AccessLevel} from 'tinkoff-api';
import { isOk } from '../lib/utils';
import { ICredentials } from '../../lib/types/api';

export class TinkoffApiManager {
    public static get() {
        if (!TinkoffApiManager.instance) {
            TinkoffApiManager.instance = new TinkoffApiManager();
        }
        return TinkoffApiManager.instance;
    }

    private static instance: TinkoffApiManager;
    private api = new TinkoffApi();

    private constructor() {}

    public async getSession(): Promise<string> {
        const res = await this.api.initializeSession();
        return res.payload;
    }

    public async singUp(credentials: ICredentials, session?: string): Promise<string> {
        let currentSession = session;
        if (!isOk(currentSession)) {
            currentSession = await this.getSession();
        }
        const signUp = await this.api.signUp(currentSession, credentials);
        return signUp.operationTicket;
    }

    public async confirmSignUp(session: string, ticketId: string, smsId: string): Promise<void> {
        await this.api.confirmSignUp(session, ticketId, smsId);
        const {payload: {accessLevel}} = await this.api.levelUp(session);
        if (accessLevel !== AccessLevel.CLIENT) {
            throw new Error(`Couldn't confirm session (${session}) - access level is ${accessLevel}`);
        }
    }
}