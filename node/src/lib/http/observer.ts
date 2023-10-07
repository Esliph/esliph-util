import { EventsRouter } from './events'
import { ObserverEmitter, ObserverListener } from '../observer'

export class ObserverServerListener extends ObserverListener<EventsRouter> {
    constructor(context = '') {
        super({ context })
    }
}

export class ObserverServerEmitter extends ObserverEmitter<EventsRouter> {
    constructor(context = '') {
        super({ context })
    }
}
