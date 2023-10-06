import { HandlerRouter, Method, RouterModel } from '../model'

export class Router<Context extends string, Name extends string, Body = any> implements RouterModel<Context, Name, Body> {
    name: Name
    handlers: HandlerRouter<Name, Body>[]
    method: Method

    constructor({ handlers, method, name }: RouterModel<Context, Name, Body>) {
        this.handlers = handlers
        this.method = method
        this.name = name
    }
}
