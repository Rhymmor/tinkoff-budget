import { ObjectKeysValidation, IValidationSchema } from "./types";

export function objectValidation<T>(properties: ObjectKeysValidation<T>): IValidationSchema {
    return {
        properties,
        type: "object",
    };
}