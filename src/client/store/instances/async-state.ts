import { observable, computed } from "mobx";
import { AsyncStoreState } from "../utils";
import { logger } from "../../lib/logger";
import { isOk } from "../../../lib/utils";

export class AsyncStateStore {
    @observable public state: AsyncStoreState = AsyncStoreState.Unknown;
    @observable public error?: string;

    @computed
    public get hasError(): boolean {
        return this.state === AsyncStoreState.Failed && isOk(this.error);
    }

    public setSuccess() {
        this.state = AsyncStoreState.Success;
        this.error = undefined;
    }

    public setFailed(e: any, log = true) {
        if (log) {
            logger.error(e);
        }

        this.state = AsyncStoreState.Failed;
        this.error = String(e);
    }

    public setPending() {
        this.state = AsyncStoreState.Loading;
        this.error = undefined;
    }
}
