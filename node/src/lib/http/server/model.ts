import { Next } from './handler/next'
import { Request } from './handler/request'
import { Response } from './handler/response'

export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

export type HandlerRouter<Body = any, Res = any> = (req: Request<Body>, res: Response, next: Next) => Promise<Res>

export type RouterModelArgs = {
    name: string
    context: string
    method: Methods
    handlers: HandlerRouter[]
}

export type RouterModel<Context extends string, Name extends string, Body = any> = {
    name: Name
    context: Context
    method: Methods
    handlers: HandlerRouter<Body>[]
}
