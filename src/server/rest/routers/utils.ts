import { RegisterOptions, FastifyRequest, FastifyReply } from "fastify";
import {Server, IncomingMessage, ServerResponse} from 'http';

export type RouterOptions = RegisterOptions<Server, IncomingMessage, ServerResponse>;
export interface IRequest<Q = null, B = null> extends FastifyRequest<IncomingMessage> {
    query: Q;
    body: B;
}
export type IResponse = FastifyReply<ServerResponse>;