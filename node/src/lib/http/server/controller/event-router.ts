import { Result } from '../../../result'
import { HttpStatusCodes } from '../../utils/status-code'
import { Request } from '../handler/request'
import { Response } from '../handler/response'
import { HandlerRouter } from '../model'
import { ObserverServerEmitter } from '../observer'

export class EventRouter<Body = any, Res = any> {
    private readonly observer: ObserverServerEmitter
    response: Response<Res>

    constructor(private request: Request<Body>, private handlers: HandlerRouter<Body>[], private isExists = true) {
        this.response = new Response<Res>()

        this.observer = new ObserverServerEmitter()
    }

    async perform() {
        this.observer.emit('router/start', { request: this.request })

        if (!this.validEventRouter()) {
            return
        }

        await this.performHandlers()
        this.validHasResponse()

        if (this.response.getResponse().isSuccess()) {
            this.observer.emit('success', { request: this.request, response: this.response.getResponse() })
        } else {
            this.observer.emit('error', { request: this.request, response: this.response.getResponse() })
        }

        this.observer.emit('router/end', { request: this.request, response: this.response.getResponse() })
    }

    private validEventRouter() {
        if (!this.isExists) {
            this.response
                .status(HttpStatusCodes.NOT_FOUND)
                .error({ title: 'HTTP Request', message: `Router ${this.request.method} "${this.request.name}" not found` })

            return false
        }

        if (!this.handlers.length) {
            this.response
                .status(HttpStatusCodes.NOT_IMPLEMENTED)
                .error({ title: 'HTTP Request', message: `Router ${this.request.method} "${this.request.name}" not implemented` })

            return false
        }

        return true
    }

    private async performHandlers() {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i]

            let isSuccess = false
            try {
                isSuccess = await this.performHandler(handler)
            } catch (err: any) {
                this.handlerPerformedWithError(err)
                isSuccess = false
            }

            if (!isSuccess) {
                return
            }
        }
    }

    private validHasResponse() {
        if (!this.response.hasResponse()) {
            this.notResponseHandlers()
        }
    }

    private async performHandler(handler: HandlerRouter<Body, any>) {
        const responseHandler = await handler(this.request, this.response)

        if (typeof responseHandler != 'undefined') {
            if (responseHandler instanceof Result) {
                this.response.status(responseHandler.getStatus())
                if (responseHandler.isSuccess()) {
                    this.response.send(responseHandler.getValue())
                } else {
                    this.response.error(responseHandler.getError())
                }
            } else {
                this.response.send(responseHandler)
            }
        }

        return this.response.getResponse().isSuccess()
    }

    private handlerPerformedWithError(err: any) {
        if (err instanceof Result) {
            this.response.status(err.getStatus()).error(err.getError())
        } else {
            this.response
                .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                .error({ title: 'HTTP Request', message: 'Server internal error', causes: [{ message: err.message, origin: err.stack }] })
        }
    }

    private notResponseHandlers() {
        this.response.status(HttpStatusCodes.BAD_GATEWAY).error({ title: 'HTTP Request', message: 'No response from server', causes: [] })
    }
}
