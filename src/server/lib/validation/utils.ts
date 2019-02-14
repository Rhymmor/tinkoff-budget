import { ObjectKeysValidation, IValidationSchema } from "./types";

export function objectValidation<T>(properties: ObjectKeysValidation<T>, requiredKeys?: string[]): IValidationSchema {
    return {
        properties,
        required: requiredKeys || Object.keys(properties),
        type: "object"
    };
}
