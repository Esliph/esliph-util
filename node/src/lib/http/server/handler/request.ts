import { Method } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    context: string
    params: { [x: string]: any }
}

export class Request<Body = any> implements RequestModel<Body> {
    body: Body
    method: Method
    name: string
    context: string
    params: { [x: string]: any }

    constructor({ body = {} as any, context = '', method = '' as any, name = '', params = {} }: Partial<RequestModel<Body>>) {
        this.body = body
        this.context = context
        this.method = method
        this.name = name
        this.params = params
    }
}
