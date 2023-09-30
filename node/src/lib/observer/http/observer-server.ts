import { Observer, EventAction } from '../observer'
import { HttpMethods } from './constants'

export class ObserverServer {
    protected observer: Observer

    constructor(private prefix = '') {
        this.observer = new Observer()
    }

    get(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.GET, eventName, action)
    }

    post(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.POST, eventName, action)
    }

    put(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.PUT, eventName, action)
    }

    patch(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.PATCH, eventName, action)
    }

    delete(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.DELETE, eventName, action)
    }

    head(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.HEAD, eventName, action)
    }

    options(eventName: string, action: EventAction) {
        return this.createEvent(HttpMethods.OPTIONS, eventName, action)
    }

    private createEvent(method: HttpMethods, eventName: string, action: EventAction) {
        return this.observer.on({ eventName: `${method}:${this.prefix}${eventName}`, action })
    }
}
