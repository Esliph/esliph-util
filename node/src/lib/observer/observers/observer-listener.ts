import { ObserverController } from '../controller'
import { Action } from '../model'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export class ObserverListener<Events extends ObserverEvent = any> {
    private static readonly _controllerObserver: ObserverController = new ObserverController()
    private readonly _controllerObserver: ObserverController
    private readonly isLocal: boolean

    constructor(repositoryLocal: ObserverRepository | null = null) {
        this._controllerObserver = new ObserverController(repositoryLocal)
        this.isLocal = !!repositoryLocal
    }

    on<Event extends keyof Events>(name: Event, action: Action<Events[Event]>) {
        return this.controllerObserver.createEvent({ action, name: name as string })
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
        if (this.isLocal) { return this._controllerObserver }
        return ObserverListener._controllerObserver
    }
}