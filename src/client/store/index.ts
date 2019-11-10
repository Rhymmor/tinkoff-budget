import "reflect-metadata";
import { Container } from "inversify";
import { SessionStore } from "./instances/session";
import { setContainer } from "./inject";
import { StoreTypes } from "./types";

const container = new Container();
setContainer(container);

container.bind<SessionStore>(StoreTypes.Session).to(SessionStore);

export { container };
