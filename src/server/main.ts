import { Server } from "./modules/server";

const port = process.env.PORT;
const server = new Server(port);
server.start();