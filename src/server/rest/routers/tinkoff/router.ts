import { FastifyInstance } from "fastify";
import { RouterOptions, IRequest, IResponse, prepareRouteSchema } from "../utils";
import { TinkoffApiManager } from "../../../modules/tinkoff-api-manager";
import { IApiSessionResponse } from "../../../../lib/types/rest/tinkoff/session";
import { schemaIApiSignUp, schemaIApiConfirm } from "./validation";
import { ApiSignUpTypes } from "../../../../lib/types/rest/tinkoff/sign-up";
import { ApiConfirmTypes } from "../../../../lib/types/rest/tinkoff/confirm";

export function registerTinkoffRouter(instance: FastifyInstance, _options: RouterOptions, next: (err?: Error) => void) {
    instance.get("/session", getSession);
    instance.post("/sign-up", { schema: prepareRouteSchema(schemaIApiSignUp) }, signUp);
    instance.post("/confirm", { schema: prepareRouteSchema(schemaIApiConfirm) }, confirmSignUp);

    next();
}

async function getSession(_req: IRequest, _res: IResponse): Promise<IApiSessionResponse> {
    const session = await TinkoffApiManager.get().getSession();
    return { session };
}

async function signUp(
    req: IRequest<ApiSignUpTypes.IQuery, ApiSignUpTypes.IBody>,
    _res: IResponse
): Promise<ApiSignUpTypes.IResponse> {
    const ticket = await TinkoffApiManager.get().singUp(req.body, req.query.session);
    return { operationalTicket: ticket };
}

async function confirmSignUp(
    { query, body }: IRequest<ApiConfirmTypes.IQuery, ApiConfirmTypes.IBody>,
    _res: IResponse
): Promise<null> {
    await TinkoffApiManager.get().confirmSignUp(query.session, body.operationalTicket, body.smsId);
    return null;
}
