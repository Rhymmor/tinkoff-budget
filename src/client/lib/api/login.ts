import { request } from "./request";
import { ApiSignUpTypes } from "../../../lib/types/rest/tinkoff/sign-up";

export namespace ApiLoginUtils {
    export function signUp(username: string, password: string) {
        const body: ApiSignUpTypes.IBody = { username, password };
        return request.post("/api/sign-up", body);
    }
}
