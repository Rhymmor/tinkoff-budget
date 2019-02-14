import { ObjectKeysValidation } from "../../../lib/validation/types";
import { IApiCommonQuery } from "../../../../lib/types/rest/tinkoff/common";
import { ApiSignUpTypes } from "../../../../lib/types/rest/tinkoff/sign-up";
import { ApiConfirmTypes } from "../../../../lib/types/rest/tinkoff/confirm";
import { ICommonSchema } from "../utils";

const defaultMaxStringLength = 50;

const schemaIApiCommonQuery: ObjectKeysValidation<IApiCommonQuery> = {
    session: { type: "string", maxLength: defaultMaxStringLength },
};

export const schemaIApiSignUp: ICommonSchema<ApiSignUpTypes.IQuery, ApiSignUpTypes.IBody> = {
    query: {
        ...schemaIApiCommonQuery,
    },
    body: {
        username: { type: "string", maxLength: defaultMaxStringLength },
        password: { type: "string", maxLength: defaultMaxStringLength },
    },
};

export const schemaIApiConfirm: ICommonSchema<ApiConfirmTypes.IQuery, ApiConfirmTypes.IBody> = {
    query: {
        ...schemaIApiCommonQuery,
    },
    body: {
        operationalTicket: { type: "string", maxLength: defaultMaxStringLength },
        smsId: { type: "string", maxLength: 4, minLength: 4 },
    },
};
