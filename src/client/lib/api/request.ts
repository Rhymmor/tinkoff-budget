import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const request = axios;

export { request };

export function setRequestMiddleware(modify: (cfg: AxiosRequestConfig) => Promise<AxiosResponse>) {
    request.defaults.adapter = modify;
}
