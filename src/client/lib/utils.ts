import { Mutator } from "./types/utils";
import cloneDeep from "lodash/cloneDeep";

export function mutate<T>(obj: T, mutator: Mutator<T>): T {
    const newObj = cloneDeep(obj);
    mutator(newObj);
    return newObj;
}
