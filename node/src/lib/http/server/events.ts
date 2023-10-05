import { ErrorResult } from '../../error'
import { Result } from '../../result'
import { Method } from './model'

type BaseRouter = {
    router: string
    method: Method
}

export type EventsRouter = {
    'router/start': ErrorResult & BaseRouter
    'router/end': ErrorResult & BaseRouter
    'error': ErrorResult & BaseRouter
    'success': Result & BaseRouter
}
