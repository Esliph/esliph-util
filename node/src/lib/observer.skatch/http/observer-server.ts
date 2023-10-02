import { ErrorResult } from '../../../../dist'
import { Console } from '../../console'
import { Observer, EventAction } from '../observer'
import { HttpMethods } from './constants'

export type ObserverServerOptions = {
    prefix: string,
    log: boolean
    template: string
}

export class ObserverServer {
    protected observer: Observer
    private console: Console

    constructor(protected optionsArgs: Partial<ObserverServerOptions> = {}, console: { log(...any: any[]): void } = new Console({ levels: optionsArgs.log, methodsValue: { context: '[HTTP]' }, ...(optionsArgs.template && { templates: { log: optionsArgs.template } }) })) {
        this.observer = new Observer()
        this.console = console as Console
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
        const hasEvent = !!this.observer.getEventByEventName(`${method}:${this.optionsArgs.prefix || ''}${eventName}`)

        if (hasEvent) {
            throw new ErrorResult({ title: 'HTTP Event', message: `Method ${method} "${this.optionsArgs.prefix || ''}${eventName}" already exists` })
        }

        this.console.log(`HTTP Event ${method} "${this.optionsArgs.prefix || ''}${eventName}" started`)
        return this.observer.on({ eventName: `${method}:${this.optionsArgs.prefix || ''}${eventName}`, action })
    }
}
