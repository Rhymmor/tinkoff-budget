import { request } from "./request";
import { ApiSignUpTypes } from "../../../lib/types/rest/tinkoff/sign-up";
import { IApiSessionResponse } from "../../../lib/types/rest/tinkoff/session";
import { ApiConfirmTypes } from "../../../lib/types/rest/tinkoff/confirm";

export namespace ApiSessionUtils {
    export function getSession() {
        return request.get<IApiSessionResponse>("/api/session");
    }
}

export namespace ApiLoginUtils {
    export function signUp(username: string, password: string) {
        const body: ApiSignUpTypes.IBody = { username, password };
        return request.post<ApiSignUpTypes.IResponse>("/api/sign-up", body);
    }

    export function confirm(smsPin: string, ticket: string) {
        const body: ApiConfirmTypes.IBody = { smsId: smsPin, operationalTicket: ticket };
        return request.post("/api/confirm", body);
    }
}
