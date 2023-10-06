import { Method } from '../model'

export type RequestModel<Body = any> = {
    body: Body
    method: Method
    name: string
    params: { [x: string]: any }
    headers: { [x: string]: any }
    dateTime: Date
}

export class Request<Body = any> implements RequestModel<Body> {
    body: Body
    method: Method
    name: string
    params: { [x: string]: any }
    dateTime: Date
    headers: { [x: string]: any }

    constructor({ body = {} as any, method = '' as any, name = '', params = {}, headers = {}, dateTime = new Date(Date.now()) }: Partial<RequestModel<Body>>) {
        this.body = body
        this.headers = headers
        this.method = method
        this.name = name
        this.params = params
        this.dateTime = dateTime
    }
}
