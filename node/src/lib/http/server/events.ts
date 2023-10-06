import { Request } from './model'
import { ResultHttp } from './result-http'

export type EventsRouter = {
    'router/start': { request: Request }
    'router/end': { response: ResultHttp; request: Request }
    'error': { response: ResultHttp; request: Request }
    'success': { response: ResultHttp; request: Request }
}
