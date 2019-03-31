import fastify = require("fastify");
import { registerTinkoffRouter } from "../rest/routers/tinkoff/router";
import fastifyStatic from "fastify-static";
import * as path from "path";

export class Server {
    private app: fastify.FastifyInstance;
    private port: number;
    private host: string;

    constructor(port = 3000, host = "localhost") {
        this.port = port;
        this.host = host;
        this.app = this.initializeApp();
    }

    public async start() {
        await this.app.listen(this.port, this.host);
    }

    private initializeApp(): fastify.FastifyInstance {
        const app = fastify({
            logger: {
                prettyPrint: process.env.NODE_ENV !== "production"
            }
        });
        app.register(registerTinkoffRouter, { prefix: "/api" });

        const projectRoot = process.env.PROJECT_ROOT || process.cwd();

        app.register(fastifyStatic, { root: path.join(projectRoot, "client-bundle") });
        app.get("/", (_req, res) => {
            res.sendFile("index.html");
        });

        return app;
    }
}
