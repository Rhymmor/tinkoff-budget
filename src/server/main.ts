import { Server } from "./modules/server";
import { isOk } from "../lib/utils";

const port = isOk(process.env.PORT) ? Number(process.env.PORT) : undefined;
const host = process.env.HOST;

const server = new Server(port, host);
server.start();
