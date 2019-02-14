import { FastifyInstance } from "fastify";
import { RouterOptions, IRequest, IResponse } from "../utils";
import { TinkoffApiManager } from "../../../modules/tinkoff-api-manager";
import { IApiSessionResponse } from "../../../../lib/types/rest/tinkoff/session";
import { schemaIApiSignUp, schemaIApiConfirm } from "./validation";
import { objectValidation } from "../../../lib/validation/utils";
import { ApiSignUpTypes } from "../../../../lib/types/rest/tinkoff/sign-up";
import { ApiConfirmTypes } from "../../../../lib/types/rest/tinkoff/confirm";

export function registerTinkoffRouter(instance: FastifyInstance, _options: RouterOptions, next: (err?: Error) => void) {
    instance.get("/session", getSession);
    instance.post(
        "/sign-up",
        {
            schema: {
                querystring: schemaIApiSignUp.query,
                body: objectValidation(schemaIApiSignUp.body),
            },
        },
        signUp,
    );
    instance.post(
        "/confirm",
        {
            schema: {
                querystring: schemaIApiConfirm.query,
                body: objectValidation(schemaIApiConfirm.body),
            },
        },
        confirmSignUp,
    );

    next();
}

async function getSession(_req: IRequest, _res: IResponse): Promise<IApiSessionResponse> {
    const session = await TinkoffApiManager.get().getSession();
    return { session };
}

async function signUp(
    req: IRequest<ApiSignUpTypes.IQuery, ApiSignUpTypes.IBody>,
    _res: IResponse,
): Promise<ApiSignUpTypes.IResponse> {
    const ticket = await TinkoffApiManager.get().singUp(req.body, req.query.session);
    return { operationalTicket: ticket };
}

async function confirmSignUp(
    { query, body }: IRequest<ApiConfirmTypes.IQuery, ApiConfirmTypes.IBody>,
    _res: IResponse,
): Promise<void> {
    await TinkoffApiManager.get().confirmSignUp(query.session, body.operationalTicket, body.smsId);
}
