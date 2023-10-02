import { Method } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    context: string
}

export class Request<Body = any> implements RequestModel<Body> {
    body: Body
    method: Method
    name: string
    context: string

    constructor({ body, context, method, name }: RequestModel<Body>) {
        this.body = body
        this.context = context
        this.method = method
        this.name = name
    }
}
