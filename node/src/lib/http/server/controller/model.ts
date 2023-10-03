import { Method } from '../model'

export type EventsModel = {
    [context: string]: {
        [method in keyof typeof Method]?: {
            [router: string]: {
                body: any
                response: any
            }
        }
    }
}
