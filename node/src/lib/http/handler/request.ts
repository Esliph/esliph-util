import { HandlerRouter, Method, RouterModelArgs } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    params: { [x: string]: any }
    dateTime: Date
    headers: { [x: string]: any }
    origin: string
    module: string
    context: string
    access: string
}

export class Request<Body = any> implements RequestModel<Body> {
    body: Body
    method: Method
    name: string
    params: { [x: string]: any }
    dateTime: Date
    headers: { [x: string]: any }
    origin: string
    module: string
    context: string
    access: string

    constructor({ body = {} as any, method = '' as any, name = '', params = {}, headers = {}, dateTime = new Date(Date.now()), access = '', context = '', module = '', origin = '' }: Partial<RequestModel<Body>>) {
        this.body = body
        this.headers = headers
        this.method = method
        this.name = name
        this.params = params
        this.dateTime = dateTime
        this.origin = origin
        this.access = access
        this.context = context
        this.module = module
    }
}
