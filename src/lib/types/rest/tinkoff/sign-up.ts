import { ICredentials } from "../../api";
import { IApiCommonQuery } from "./common";

export interface IApiSignUpQuery extends IApiCommonQuery {}

export type IApiSignUpBody = ICredentials;

export interface IApiSignUpResponse {
    operationalTicket: string;
}