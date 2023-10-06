import { Method } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    context: string
    origin: string
    module: string
    params: { [x: string]: any }
    headers: { [x: string]: any }
    dateTime: Date
}

export class Request<Body = any> implements RequestModel<Body> {
    body: Body
    method: Method
    name: string
    context: string
    params: { [x: string]: any }
    dateTime: Date
    headers: { [x: string]: any }
    origin: string
    module: string

    constructor({
        body = {} as any,
        context = '',
        method = '' as any,
        name = '',
        params = {},
        headers = {},
        origin = '',
        module = '',
        dateTime = new Date(Date.now()),
    }: Partial<RequestModel<Body>>) {
        this.body = body
        this.headers = headers
        this.context = context
        this.method = method
        this.name = name
        this.params = params
        this.dateTime = dateTime
        this.origin = origin
        this.module = module
    }
}
