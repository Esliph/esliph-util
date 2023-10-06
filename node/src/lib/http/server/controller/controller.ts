import { ErrorResult } from '../../../error'
import { Request, RequestModel } from '../handler/request'
import { Method, RouterModelArgs } from '../model'
import { Router } from '../router/router'
import { EventRouter } from './event-router'
import { ServerRepository } from './repository'

export class ServerController {
    protected static readonly repository = new ServerRepository({ isolated: true })

    createRouter({ handlers, method, name }: RouterModelArgs) {
        if (this.findRouter({ name })) {
            throw new ErrorResult({ title: 'HTTP Server', message: `Already exists router ${method} "${name}"` })
        }

        this.repository.create({ data: { handlers, method, name } })
    }

    async performRouter<Body = any, Res = any>({ method, name, body, headers, params }: Omit<RequestModel, 'dateTime'>) {
        const router = this.findRouter({ name })

        const request = new Request({ body, method, name, headers, params })

        const eventRouter = new EventRouter<Body, Res>(request, router?.handlers || ([] as any), !!router)

        await eventRouter.perform()

        return eventRouter.response.getResponse()
    }

    protected findRouter({ name }: { name: string }) {
        const router = this.repository.findFirst({ where: { name: { equals: name } } })

        if (!router) {
            return null
        }

        return new Router(router)
    }

    protected get repository() {
        return ServerController.repository
    }
}
