import { EventsRouter } from './events'
import { ObserverEmitter, ObserverListener } from '../../observer'

export class ObserverServerListener extends ObserverListener<EventsRouter> {
    constructor() { super() }
}

export class ObserverServerEmitter extends ObserverEmitter<EventsRouter> {
    constructor() { super() }
}