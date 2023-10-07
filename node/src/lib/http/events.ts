import { Request } from './handler/request'
import { ResultHttp } from './result-http'

export type EventsRouter = {
    'request/start': { request: Request }
    'request/end': { response: ResultHttp; request: Request }
    'request/error': { response: ResultHttp; request: Request }
    'request/success': { response: ResultHttp; request: Request }
}
