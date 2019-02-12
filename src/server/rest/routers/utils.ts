import { RegisterOptions, FastifyRequest, FastifyReply } from "fastify";
import {Server, IncomingMessage, ServerResponse} from 'http';

export type RouterOptions = RegisterOptions<Server, IncomingMessage, ServerResponse>;
export type IRequest = FastifyRequest<IncomingMessage>;
export type IResponse = FastifyReply<ServerResponse>;