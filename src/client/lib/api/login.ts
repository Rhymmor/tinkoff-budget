import { request } from "./request";
import { ApiSignUpTypes } from "../../../lib/types/rest/tinkoff/sign-up";
import { IApiSessionResponse } from "../../../lib/types/rest/tinkoff/session";

export namespace ApiSessionUtils {
    export function getSession() {
        return request.get<IApiSessionResponse>("/api/session");
    }
}

export namespace ApiLoginUtils {
    export function signUp(username: string, password: string) {
        const body: ApiSignUpTypes.IBody = { username, password };
        return request.post("/api/sign-up", body);
    }
}
