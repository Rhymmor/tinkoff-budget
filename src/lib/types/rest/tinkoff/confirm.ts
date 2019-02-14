import { IApiCommonQuery } from "./common";

export namespace ApiConfirmTypes {
    export interface IQuery extends IApiCommonQuery {}
    export interface IBody {
        operationalTicket: string;
        smsId: string;
    }
}
