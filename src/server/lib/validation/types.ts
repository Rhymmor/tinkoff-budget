import { UseKeys } from "tinkoff-api/build/src/lib/util-types";

export interface IValidationSchema {
    type: string | string[];
    // numbers
    minimum?: number;
    maximum?: number;
    // strings
    maxLength?: number;
    minLength?: number;
    // arrays
    maxItems?: string;
    minItems?: string;
    items?: IValidationSchema[];
    // objects
    properties?: Record<string, IValidationSchema>;
}

export type ObjectKeysValidation<T> = Required<UseKeys<T, IValidationSchema>>;