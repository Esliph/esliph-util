import { EventsModel } from '../controller/model'
import { ServerController } from '../controller/controller'
import { Method } from '../model'
import { ObserverServerListener } from '../observer'
import { deepMerge } from '../../../repository-memory/util'
import { ResultHttp } from '../result-http'

export type RequestOption = {
    headers: { [x: string]: any }
    params: { [x: string]: any }
    origem: string
    module: string
    context: string
}

export class Client<Events extends EventsModel> extends ObserverServerListener {
    private readonly controller: ServerController
    private requestOptions: RequestOption

    constructor(requestOptions: Partial<RequestOption> = {}) {
        super()

        this.controller = new ServerController()
        this.requestOptions = {
            headers: {},
            params: {},
            origem: '',
            module: '',
            context: '',
            ...requestOptions,
        }
    }

    async get<Event extends keyof Events['GET']>(
        name: Event,
        body?: Events['GET'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['GET'][Event]['response']>> {
        const response = await this.performRouter<Events['GET'][Event]['body'], Events['GET'][Event]['response']>(Method.GET, name as string, body, options)

        return response
    }

    async post<Event extends keyof Events['POST']>(
        name: Event,
        body?: Events['POST'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['POST'][Event]['response']>> {
        const response = await this.performRouter<Events['POST'][Event]['body'], Events['POST'][Event]['response']>(Method.POST, name as string, body, options)

        return response
    }

    async put<Event extends keyof Events['PUT']>(
        name: Event,
        body?: Events['PUT'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['PUT'][Event]['response']>> {
        const response = await this.performRouter<Events['PUT'][Event]['body'], Events['PUT'][Event]['response']>(Method.PUT, name as string, body, options)

        return response
    }

    async patch<Event extends keyof Events['PATCH']>(
        name: Event,
        body?: Events['PATCH'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['PATCH'][Event]['response']>> {
        const response = await this.performRouter<Events['PATCH'][Event]['body'], Events['PATCH'][Event]['response']>(
            Method.PATCH,
            name as string,
            body,
            options
        )

        return response
    }

    async delete<Event extends keyof Events['DELETE']>(
        name: Event,
        body?: Events['DELETE'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['DELETE'][Event]['response']>> {
        const response = await this.performRouter<Events['DELETE'][Event]['body'], Events['DELETE'][Event]['response']>(
            Method.DELETE,
            name as string,
            body,
            options
        )

        return response
    }

    async head<Event extends keyof Events['HEAD']>(
        name: Event,
        body?: Events['HEAD'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['HEAD'][Event]['response']>> {
        const response = await this.performRouter<Events['HEAD'][Event]['body'], Events['HEAD'][Event]['response']>(Method.GET, name as string, body, options)

        return response
    }

    async options<Event extends keyof Events['OPTIONS']>(
        name: Event,
        body?: Events['OPTIONS'][Event]['body'],
        options?: Partial<RequestOption>
    ): Promise<ResultHttp<Events['OPTIONS'][Event]['response']>> {
        const response = await this.performRouter<Events['OPTIONS'][Event]['body'], Events['OPTIONS'][Event]['response']>(
            Method.OPTIONS,
            name as string,
            body,
            options
        )

        return response
    }

    private async performRouter<Body = any, Res = any>(method: Method, name: string, body: any = {}, options: Partial<RequestOption> = {}) {
        const fullOptions = deepMerge({}, this.requestOptions, options) as RequestOption

        const response = await this.controller.performRouter<Body, Res>({
            name,
            body,
            method,
            context: fullOptions.context,
            headers: fullOptions.headers,
            params: fullOptions.params,
            module: fullOptions.module,
            origem: fullOptions.origem,
        })

        return response
    }
}
