import { HandlerRouter, Methods, RouterModelArgs } from '../model'

export class Router implements RouterModelArgs {
    context: string
    name: string
    handlers: HandlerRouter<any, any>[]
    method: Methods

    constructor({ context, handlers, method, name }: RouterModelArgs) {
        this.context = context
        this.handlers = handlers
        this.method = method
        this.name = name
    }
}
