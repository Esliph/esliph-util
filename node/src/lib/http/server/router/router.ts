import { HandlerRouter, Method, RouterModel } from '../model'

export class Router<Context extends string, Name extends string, Body = any> implements RouterModel<Context, Name, Body> {
    context: Context
    name: Name
    handlers: HandlerRouter<Body>[]
    method: Method

    constructor({ context, handlers, method, name }: RouterModel<Context, Name, Body>) {
        this.context = context
        this.handlers = handlers
        this.method = method
        this.name = name
    }
}
