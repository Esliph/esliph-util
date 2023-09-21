export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

export type EventsObserverHttp = {
    [x: string]: {
        request: any
        response: any
        params?: { [y: string]: any }
    }
}
