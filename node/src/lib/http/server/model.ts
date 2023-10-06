import { Result } from '../../result'
import { EventsRouter } from './events'
import { Request } from './handler/request'
import { Response } from './handler/response'

export { Request, Response, EventsRouter }
export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

export type HandlerRouter<Body = any, Res = any> = (req: Request<Body>, res: Response<Res>) => Promise<void | Result<Res>> | void | Result<Res> | Res

export type RouterModelArgs = {
    name: string
    context: string
    method: Method
    handlers: HandlerRouter[]
}

export type RouterModel<Context extends string, Name extends string, Body = any> = {
    name: Name
    context: Context
    method: Method
    handlers: HandlerRouter<Name, Body>[]
}
