import { Result } from '../result'
import { Request } from './handler/request'
import { Response } from './handler/response'

export enum Method {
    'GET' = 'GET',
    'POST' = 'POST',
    'PUT' = 'PUT',
    'PATCH' = 'PATCH',
    'DELETE' = 'DELETE',
    'HEAD' = 'HEAD',
    'OPTIONS' = 'OPTIONS',
}

export type HandlerRouter<Body = any, Res = any> = (req: Request<Body>, res: Response<Res>) => Promise<void | Result<Res>> | void | Result<Res> | Res

export type RouterModelArgs = {
    name: string
    method: Method
    module: string
    context: string
    access: string
    handlers: HandlerRouter[]
}

export type RouterModel<Name extends string, Body = any> = {
    name: Name
    method: Method
    module: string
    context: string
    access: string
    handlers: HandlerRouter<Name, Body>[]
}
