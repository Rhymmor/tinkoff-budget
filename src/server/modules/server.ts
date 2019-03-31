import fastify = require("fastify");
import { registerTinkoffRouter } from "../rest/routers/tinkoff/router";

export class Server {
    private app: fastify.FastifyInstance;
    private port: string;

    constructor(port = "3000") {
        this.port = port;
        this.app = this.initializeApp();
    }

    public async start() {
        await this.app.listen(this.port);
    }

    private initializeApp(): fastify.FastifyInstance {
        const app = fastify({
            logger: {
                prettyPrint: process.env.NODE_ENV !== "production"
            }
        });
        app.register(registerTinkoffRouter, { prefix: "/api" });
        return app;
    }
}
