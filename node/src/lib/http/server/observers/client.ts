import { Result } from '../../../result'
import { EventsModel } from '../controller/model'
import { ServerController } from '../controller/controller'
import { Method } from '../model'

export type ClientConfig = {
    context: string
    prefix: string
}

export class Client<ContextEvents extends EventsModel, Context extends keyof ContextEvents> {
    private readonly controller: ServerController
    private config: ClientConfig

    constructor(config: Partial<ClientConfig> = {}) {
        this.controller = new ServerController()
        this.config = {
            context: config.context || '',
            prefix: config.prefix || '',
        }
    }

    async get<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body)

        return response
    }

    async post<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.POST, name as string, body)

        return response
    }

    async put<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.PUT, name as string, body)

        return response
    }

    async patch<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.PATCH, name as string, body)

        return response
    }

    async delete<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.DELETE, name as string, body)

        return response
    }

    async head<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.GET, name as string, body)

        return response
    }

    async options<Event extends keyof ContextEvents[Context]>(
        name: Event,
        body: ContextEvents[Context][Event]['body']
    ): Promise<Result<ContextEvents[Context][Event]['response']>> {
        const response = await this.performRouter(Method.OPTIONS, name as string, body)

        return response
    }

    private async performRouter(method: Method, name: string, body: any) {
        const response = await this.controller.performRouter({ name, body, context: this.config.context, method })

        return response
    }
}
