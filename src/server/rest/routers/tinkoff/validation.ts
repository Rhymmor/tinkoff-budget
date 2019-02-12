import { ObjectKeysValidation } from "../../../lib/validation/types";
import { IApiCommonQuery } from "../../../../lib/types/rest/tinkoff/common";
import { IApiSignUpQuery, IApiSignUpBody } from "../../../../lib/types/rest/tinkoff/sign-up";

const schemaIApiCommonQuery: ObjectKeysValidation<IApiCommonQuery> = {
    session: { type: 'string', maxLength: 100 }
};

interface ISchemaApiSignUp {
    query: ObjectKeysValidation<IApiSignUpQuery>;
    body: ObjectKeysValidation<IApiSignUpBody>;
}

export const schemaIApiSignUp: ISchemaApiSignUp = {
    query: {
        ...schemaIApiCommonQuery
    },
    body: {
        username: { type: 'string', maxLength: 100 },
        password: { type: 'string', maxLength: 100 },
    }
};