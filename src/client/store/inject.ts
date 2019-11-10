import getDecorators from "inversify-inject-decorators";
import { Container } from "inversify";

let lazyInject: (serviceKey: string) => (proto: any, key: string) => void;

export function setContainer(container: Container) {
    lazyInject = getDecorators(container).lazyInject;
}

export { lazyInject };
