import fastify = require('fastify');

export class Server {
    private app: fastify.FastifyInstance;
    private port: string;

    constructor(port = '8000') {
        this.port = port;
        this.app = fastify({
            logger: true
        });
    }

    public async start() {
        await this.app.listen(this.port);
    }
}