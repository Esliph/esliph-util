import { Result } from '../../../result'
import { EventsModel } from '../controller/model'
import { ServerController } from '../controller/controller'
import { Method } from '../model'
import { ObserverListener } from '../../../observer'

export class Client<ContextEvents extends EventsModel, Context extends keyof ContextEvents> extends ObserverListener {
    private readonly controller: ServerController
    private context: Context

    constructor(context: Context) {
        super()

        this.controller = new ServerController()
        this.context = context
    }

    async get<Event extends keyof ContextEvents[Context]['GET']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['GET'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['GET'][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body)

        return response
    }

    async post<Event extends keyof ContextEvents[Context]['POST']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['POST'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['POST'][Event]['response']>> {
        const response = await this.performRouter(Method.POST, name as string, body)

        return response
    }

    async put<Event extends keyof ContextEvents[Context]['PUT']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['PUT'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['PUT'][Event]['response']>> {
        const response = await this.performRouter(Method.PUT, name as string, body)

        return response
    }

    async patch<Event extends keyof ContextEvents[Context]['PATCH']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['PATCH'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['PATCH'][Event]['response']>> {
        const response = await this.performRouter(Method.PATCH, name as string, body)

        return response
    }

    async delete<Event extends keyof ContextEvents[Context]['DELETE']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['DELETE'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['DELETE'][Event]['response']>> {
        const response = await this.performRouter(Method.DELETE, name as string, body)

        return response
    }

    async head<Event extends keyof ContextEvents[Context]['HEAD']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['HEAD'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['HEAD'][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body)

        return response
    }

    async options<Event extends keyof ContextEvents[Context]['OPTIONS']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['OPTIONS'][Event]['body']
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['OPTIONS'][Event]['response']>> {
        const response = await this.performRouter(Method.OPTIONS, name as string, body)

        return response
    }

    private async performRouter(method: Method, name: string, body: any) {
        const response = await this.controller.performRouter({ name, body, context: this.context as string, method })

        return response
    }
}
