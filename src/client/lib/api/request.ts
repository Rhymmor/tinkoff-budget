import axios, { AxiosRequestConfig } from "axios";
// tslint:disable-next-line:no-var-requires
const { Service } = require("axios-middleware");

const request = axios;

const service = new Service(axios);

export { request };

export function setRequestMiddleware(modify?: (cfg: AxiosRequestConfig) => AxiosRequestConfig) {
    if (modify) {
        service.register({
            onRequest(config: AxiosRequestConfig) {
                return modify(config);
            }
        });
    } else {
        service.reset();
    }
}
