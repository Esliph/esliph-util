import { Result } from '../../../result'
import { EventsModel } from '../controller/model'
import { ServerController } from '../controller/controller'
import { Method } from '../model'
import { ObserverServerListener } from '../observer'
import { deepMerge } from '../../../repository-memory/util'

export type RequestOption = {
    headers: { [x: string]: any }
    params: { [x: string]: any }
    origem: string
    module: string
}

export class Client<ContextEvents extends EventsModel, Context extends keyof ContextEvents> extends ObserverServerListener {
    private readonly controller: ServerController
    private context: Context
    private requestOptions: RequestOption

    constructor(context: Context, requestOptions: Partial<RequestOption> = {}) {
        super()

        this.controller = new ServerController()
        this.context = context
        this.requestOptions = {
            headers: {},
            params: {},
            origem: '',
            module: '',
            ...requestOptions,
        }
    }

    async get<Event extends keyof ContextEvents[Context]['GET']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['GET'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['GET'][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body, options)

        return response
    }

    async post<Event extends keyof ContextEvents[Context]['POST']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['POST'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['POST'][Event]['response']>> {
        const response = await this.performRouter(Method.POST, name as string, body, options)

        return response
    }

    async put<Event extends keyof ContextEvents[Context]['PUT']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['PUT'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['PUT'][Event]['response']>> {
        const response = await this.performRouter(Method.PUT, name as string, body, options)

        return response
    }

    async patch<Event extends keyof ContextEvents[Context]['PATCH']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['PATCH'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['PATCH'][Event]['response']>> {
        const response = await this.performRouter(Method.PATCH, name as string, body, options)

        return response
    }

    async delete<Event extends keyof ContextEvents[Context]['DELETE']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['DELETE'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['DELETE'][Event]['response']>> {
        const response = await this.performRouter(Method.DELETE, name as string, body, options)

        return response
    }

    async head<Event extends keyof ContextEvents[Context]['HEAD']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['HEAD'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['HEAD'][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body, options)

        return response
    }

    async options<Event extends keyof ContextEvents[Context]['OPTIONS']>(
        name: Event,
        // @ts-expect-error
        body: ContextEvents[Context]['OPTIONS'][Event]['body'],
        options?: Partial<RequestOption>
        // @ts-expect-error
    ): Promise<Result<ContextEvents[Context]['OPTIONS'][Event]['response']>> {
        const response = await this.performRouter(Method.OPTIONS, name as string, body, options)

        return response
    }

    private async performRouter(method: Method, name: string, body: any, options: Partial<RequestOption> = {}) {
        const fullOptions = deepMerge({}, this.requestOptions, options) as RequestOption

        const response = await this.controller.performRouter({
            name,
            body,
            context: this.context as string,
            method,
            headers: fullOptions.headers,
            params: fullOptions.params,
            module: fullOptions.module,
            origem: fullOptions.origem,
        })

        return response
    }
}
