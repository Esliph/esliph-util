import { ServerController } from '../controller/controller'
import { EventsModel } from '../controller/model'
import { HandlerRouter, Method } from '../model'
import { ObserverListener } from '../../../observer'

export class Server<ContextEvents extends EventsModel, Context extends keyof ContextEvents> extends ObserverListener {
    private readonly controller: ServerController
    private context: Context

    constructor(context: Context) {
        super()

        this.controller = new ServerController()
        this.context = context
    }

    get<Event extends keyof ContextEvents[Context]['GET']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['GET'][Event]['body'], ContextEvents[Context]['GET'][Event]['response']>[]
    ) {
        this.createRouter(Method.GET, name as string, handlers)
    }

    post<Event extends keyof ContextEvents[Context]['POST']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['POST'][Event]['body'], ContextEvents[Context]['POST'][Event]['response']>[]
    ) {
        this.createRouter(Method.POST, name as string, handlers)
    }

    put<Event extends keyof ContextEvents[Context]['PUT']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['PUT'][Event]['body'], ContextEvents[Context]['PUT'][Event]['response']>[]
    ) {
        this.createRouter(Method.PUT, name as string, handlers)
    }

    patch<Event extends keyof ContextEvents[Context]['PATCH']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['PATCH'][Event]['body'], ContextEvents[Context]['PATCH'][Event]['response']>[]
    ) {
        this.createRouter(Method.PATCH, name as string, handlers)
    }

    delete<Event extends keyof ContextEvents[Context]['DELETE']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['DELETE'][Event]['body'], ContextEvents[Context]['DELETE'][Event]['response']>[]
    ) {
        this.createRouter(Method.DELETE, name as string, handlers)
    }

    head<Event extends keyof ContextEvents[Context]['HEAD']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['HEAD'][Event]['body'], ContextEvents[Context]['HEAD'][Event]['response']>[]
    ) {
        this.createRouter(Method.HEAD, name as string, handlers)
    }

    options<Event extends keyof ContextEvents[Context]['OPTIONS']>(
        name: Event,
        // @ts-expect-error
        ...handlers: HandlerRouter<ContextEvents[Context]['OPTIONS'][Event]['body'], ContextEvents[Context]['OPTIONS'][Event]['response']>[]
    ) {
        this.createRouter(Method.OPTIONS, name as string, handlers)
    }

    private createRouter(method: Method, name: string, handlers: HandlerRouter[]) {
        this.controller.createRouter({ context: this.context as string, handlers, method, name })
    }
}
