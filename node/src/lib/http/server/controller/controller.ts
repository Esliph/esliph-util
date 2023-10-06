import { ErrorResult } from '../../../error'
import { Request, RequestModel } from '../handler/request'
import { Method, RouterModelArgs } from '../model'
import { Router } from '../router/router'
import { EventRouter } from './event-router'
import { ServerRepository } from './repository'

export class ServerController {
    protected static readonly repository = new ServerRepository({ isolated: true })

    createRouter({ context, handlers, method, name }: RouterModelArgs) {
        if (this.findRouter({ context, method, name })) {
            throw new ErrorResult({ title: 'HTTP Server', message: `Already exists router ${method} "${name}" in context "${context}"` })
        }

        this.repository.create({ data: { context, handlers, method, name } })
    }

    async performRouter({ context, method, name, body, headers, params }: Omit<RequestModel, 'dateTime'>) {
        const router = this.findRouter({ context, method, name })

        const request = new Request({ body, context, method, name, headers, params })

        const eventRouter = new EventRouter(request, router?.handlers || [], !!router)

        await eventRouter.perform()

        return eventRouter.response.getResponse()
    }

    protected findRouter({ context, method, name }: { context: string; method: Method; name: string }) {
        const router = this.repository.findFirst({ where: { context: { equals: context }, method: { equals: method }, name: { equals: name } } })

        if (!router) {
            return null
        }

        return new Router(router)
    }

    protected get repository() {
        return ServerController.repository
    }
}
