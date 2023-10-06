import { ObserverController } from '../controller'
import { Action } from '../model'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export type ObserverListenerOptions = {
    context: string
    isLocal: boolean
}

export class ObserverListener<Events extends ObserverEvent = any> {
    private static readonly _controllerObserver: ObserverController = new ObserverController()
    private readonly _controllerObserver: ObserverController
    private _options: ObserverListenerOptions

    constructor(options: Partial<ObserverListenerOptions> = {}, repositoryLocal: ObserverRepository | null = null) {
        this._controllerObserver = new ObserverController(repositoryLocal)
        this._options = {
            context: options.context || '',
            isLocal: !!options.isLocal,
        }
    }

    on<Event extends keyof Events>(name: Event, action: Action<Events[Event]>, context = this._options.context) {
        return this.controllerObserver.createEvent({ action, name: name as string, context })
    }

    removeListener(code: number) {
        this.controllerObserver.removeEvent(code)
    }

    static on<Events extends ObserverEvent, Event extends keyof Events>(name: Event, action: Action<Events[Event]>) {
        return this._controllerObserver.createEvent({ action, name: name as string })
    }

    static removeListener(code: number) {
        this._controllerObserver.removeEvent(code)
    }

    private get controllerObserver() {
        if (this._options.isLocal) {
            return this._controllerObserver
        }
        return ObserverListener._controllerObserver
    }
}
