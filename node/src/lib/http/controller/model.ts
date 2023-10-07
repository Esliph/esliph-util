import { Method } from '../model'

export type EventsModel = {
    [method in keyof typeof Method]: {
        [x in string]: {
            'body': any
            'response': any
        }
    }
}
