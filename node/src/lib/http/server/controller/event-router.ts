import { HttpStatusCodes } from '../../utils/status-code'
import { Request } from '../handler/request'
import { Response } from '../handler/response'
import { HandlerRouter } from '../model'

export class EventRouter<Body = any, Res = any> {
    constructor(private request: Request<Body>, private handlers: HandlerRouter<Body>[], private isExists = true) {}

    async perform() {
        const response = new Response<Res>()

        if (!this.isExists) {
            response
                .status(HttpStatusCodes.NOT_FOUND)
                .error({ title: 'HTTP Request', message: `Router ${this.request.method} "${this.request.name}" not found`, causes: [] })

            return response.getResponse()
        }

        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i]

            await handler(this.request, response)

            if (!response.getResponse().isSuccess()) {
                return response.getResponse()
            }
        }

        return response.getResponse()
    }
}