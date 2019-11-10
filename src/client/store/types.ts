import { SessionStore } from "./instances/session";

export enum StoreTypes {
    Session = "Session"
}

export interface IStore {
    [StoreTypes.Session]: SessionStore;
}
