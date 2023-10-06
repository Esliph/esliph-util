import { ServerController } from '../controller/controller'
import { EventsModel } from '../controller/model'
import { HandlerRouter, Method } from '../model'
import { ObserverServerListener } from '../observer'

export type ServerOption = {
    access: string, context: string, module: string
}

export class Server<ContextEvents extends EventsModel> extends ObserverServerListener {
    private readonly controller: ServerController
    private requestOptions: ServerOption

    constructor(requestOptions: Partial<ServerOption> = {}) {
        super()

        this.controller = new ServerController()
        this.requestOptions = {
            access: '', context: '', module: '',
            ...requestOptions,
        }
    }

    get<Event extends keyof ContextEvents['GET']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['GET'][Event]['body'], ContextEvents['GET'][Event]['response']>[]
    ) {
        this.createRouter(Method.GET, name as string, handlers)
    }

    post<Event extends keyof ContextEvents['POST']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['POST'][Event]['body'], ContextEvents['POST'][Event]['response']>[]
    ) {
        this.createRouter(Method.POST, name as string, handlers)
    }

    put<Event extends keyof ContextEvents['PUT']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['PUT'][Event]['body'], ContextEvents['PUT'][Event]['response']>[]
    ) {
        this.createRouter(Method.PUT, name as string, handlers)
    }

    patch<Event extends keyof ContextEvents['PATCH']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['PATCH'][Event]['body'], ContextEvents['PATCH'][Event]['response']>[]
    ) {
        this.createRouter(Method.PATCH, name as string, handlers)
    }

    delete<Event extends keyof ContextEvents['DELETE']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['DELETE'][Event]['body'], ContextEvents['DELETE'][Event]['response']>[]
    ) {
        this.createRouter(Method.DELETE, name as string, handlers)
    }

    head<Event extends keyof ContextEvents['HEAD']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['HEAD'][Event]['body'], ContextEvents['HEAD'][Event]['response']>[]
    ) {
        this.createRouter(Method.HEAD, name as string, handlers)
    }

    options<Event extends keyof ContextEvents['OPTIONS']>(
        name: Event,
        ...handlers: HandlerRouter<ContextEvents['OPTIONS'][Event]['body'], ContextEvents['OPTIONS'][Event]['response']>[]
    ) {
        this.createRouter(Method.OPTIONS, name as string, handlers)
    }

    private createRouter(method: Method, name: string, handlers: HandlerRouter[]) {
        this.controller.createRouter({ handlers, method, name, access: this.requestOptions.access, context: this.requestOptions.context, module: this.requestOptions.module })
    }
}
