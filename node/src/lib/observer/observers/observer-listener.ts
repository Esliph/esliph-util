import { ObserverController } from '../controller'
import { Action } from '../model'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export class ObserverListener<Events extends ObserverEvent = any> {
    private readonly controllerObserver: ObserverController

    constructor(repositoryLocal: ObserverRepository | null = null) {
        this.controllerObserver = new ObserverController(repositoryLocal)
    }

    on<Event extends keyof Events>(name: Event, action: Action<Events[Event]>) {
        return this.controllerObserver.createEvent({ action, name: name as string })
    }

    removeListener(code: number) {
        this.controllerObserver.removeEvent(code)
    }
}
