import {
    RegisterOptions,
    FastifyRequest,
    FastifyReply,
    DefaultParams,
    DefaultQuery,
    DefaultHeaders,
    RouteSchema,
} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { ObjectKeysValidation } from "../../lib/validation/types";
import { objectValidation } from "../../lib/validation/utils";

export type RouterOptions = RegisterOptions<Server, IncomingMessage, ServerResponse>;
export type IRequest<Q = DefaultQuery, B = null, P = DefaultParams> = FastifyRequest<
    IncomingMessage,
    Q,
    P,
    DefaultHeaders,
    B
>;
export type IResponse = FastifyReply<ServerResponse>;

export interface ICommonSchema<Q = any, B = any> {
    query: ObjectKeysValidation<Q>;
    body: ObjectKeysValidation<B>;
}

export function prepareRouteSchema(schema: ICommonSchema): RouteSchema {
    return {
        querystring: schema.query,
        body: objectValidation(schema.body),
    };
}
