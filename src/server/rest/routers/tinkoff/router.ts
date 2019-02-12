import {FastifyInstance} from 'fastify';
import { RouterOptions, IRequest, IResponse } from '../utils';
import { TinkoffApiManager } from '../../../modules/tinkoff-api-manager';
import { IApiSessionResponse } from '../../../../lib/types/rest/tinkoff/session';
import { schemaIApiSignUp } from './validation';
import { objectValidation } from '../../../lib/validation/utils';
import { IApiSignUpQuery, IApiSignUpBody, IApiSignUpResponse } from '../../../../lib/types/rest/tinkoff/sign-up';

export function registerTinkoffRouter(instance: FastifyInstance, _options: RouterOptions, next: (err?: Error) => void) {
    instance.get('/session', getSession);
    instance.post(
		'/sign-up',
        {
            schema: {
                querystring: schemaIApiSignUp.query,
                body: objectValidation(schemaIApiSignUp.body),
            },
        },
		signUp,
	);

    next();
}

async function getSession(_req: IRequest, _res: IResponse): Promise<IApiSessionResponse> {
    const session = await TinkoffApiManager.get().getSession();
    return {session};
}

async function signUp(req: IRequest<IApiSignUpQuery, IApiSignUpBody>, _res: IResponse): Promise<IApiSignUpResponse> {
    const ticket = await TinkoffApiManager.get().singUp(req.body, req.query.session);
    return {operationalTicket: ticket};
}