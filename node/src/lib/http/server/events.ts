import { Result } from '../../result'
import { Request } from './model'

export type EventsRouter = {
    'router/start': { request: Request }
    'router/end': { response: Result, request: Request }
    'error': { response: Result, request: Request }
    'success': { response: Result, request: Request }
}
