import { Method } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    context: string
    origem: string
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
    origem: string
    module: string

    constructor({
        body = {} as any,
        context = '',
        method = '' as any,
        name = '',
        params = {},
        headers = {},
        origem = '',
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
        this.origem = origem
        this.module = module
    }
}
