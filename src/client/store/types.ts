import { SessionStore } from "./session";

export enum StoreTypes {
    Session = "Session"
}

export interface IStore {
    [StoreTypes.Session]: SessionStore;
}
