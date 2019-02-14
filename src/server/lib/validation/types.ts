import { UseKeys } from "../../../lib/utils";

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
    required?: string[];
}

export type ObjectKeysValidation<T> = Required<UseKeys<T, IValidationSchema>>;
