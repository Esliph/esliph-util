import { Result } from '../../../result'
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

            try {
                const responseHandler = await handler(this.request, response)

                if (typeof responseHandler != 'undefined') {
                    if (responseHandler instanceof Result) {
                        response.status(responseHandler.getStatus())
                        if (responseHandler.isSuccess()) {
                            response.send(responseHandler.getValue())
                        } else {
                            response.error(responseHandler.getError())
                        }
                    } else {
                        response.send(responseHandler)
                    }
                }
            } catch (err: any) {
                if (err instanceof Result) {
                    response.status(err.getStatus()).error(err.getError())
                } else {
                    response
                        .status(HttpStatusCodes.BAD_GATEWAY)
                        .error({ title: 'HTTP Request', message: 'Server internal error', causes: [{ message: err.message, origin: err.stack }] })
                }
            }

            if (!response.getResponse().isSuccess()) {
                return response.getResponse()
            }
        }

        return response.getResponse()
    }
}
