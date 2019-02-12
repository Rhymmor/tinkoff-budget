import {FastifyInstance} from 'fastify';
import { RouterOptions, IRequest, IResponse } from '../utils';
import { TinkoffApiManager } from '../../../modules/tinkoff-api-manager';
import { IApiSessionResponse } from '../../../../lib/types/rest/tinkoff';

export function registerTinkoffRouter(instance: FastifyInstance, _options: RouterOptions, next: (err?: Error) => void) {
    instance.get('/session', getSession);

    next();
}

async function getSession(_req: IRequest, _res: IResponse): Promise<IApiSessionResponse> {
    const session = await TinkoffApiManager.get().getSession();
    return {session};
}