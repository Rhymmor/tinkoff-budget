import { ICredentials } from "../../api";
import { IApiCommonQuery } from "./common";

export namespace ApiSignUpTypes {
    export interface IQuery extends IApiCommonQuery {}
    export type IBody = ICredentials;
    export interface IResponse {
        operationalTicket: string;
    }
}
