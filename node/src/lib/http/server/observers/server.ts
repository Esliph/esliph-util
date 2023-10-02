import { ServerController } from '../controller/controller'
import { EventsModel } from '../controller/model'
import { HandlerRouter, Method } from '../model'

export type ServerConfig = {
    context: string
    prefix: string
}

export class Server<ContextEvents extends EventsModel, Context extends keyof ContextEvents> {
    private readonly controller: ServerController
    private config: ServerConfig

    constructor({ context = '' as any, prefix = '' }: Partial<{ context: Context; prefix: string }>) {
        this.controller = new ServerController()
        this.config = {
            context: context as any,
            prefix,
        }
    }

    get<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.GET, name as string, handlers)
    }

    post<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.POST, name as string, handlers)
    }

    put<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.PUT, name as string, handlers)
    }

    patch<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.PATCH, name as string, handlers)
    }

    delete<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.DELETE, name as string, handlers)
    }

    head<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.HEAD, name as string, handlers)
    }

    options<Event extends keyof ContextEvents[Context]>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents[Context][Event]['body'], ContextEvents[Context][Event]['response']>[]
    ) {
        this.createRouter(Method.OPTIONS, name as string, handlers)
    }

    private createRouter(method: Method, name: string, handlers: HandlerRouter[]) {
        this.controller.createRouter({ context: this.config.context, handlers, method, name })
    }
}
