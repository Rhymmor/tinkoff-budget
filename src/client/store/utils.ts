export enum AsyncStoreState {
    Success = "success",
    Loading = "loading",
    Failed = "failed",
    Unknown = "unknown"
}

export interface IAsyncStore {
    state: AsyncStoreState;
    error?: string;
}
