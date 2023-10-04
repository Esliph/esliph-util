import { ObserverController } from '../controller'
import { Action } from '../model'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export class ObserverListener<Events extends ObserverEvent = any> {
    private readonly controller: ObserverController

    constructor(repositoryLocal: ObserverRepository | null = null) {
        this.controller = new ObserverController(repositoryLocal)
    }

    on<Event extends keyof Events>(name: Event, action: Action<Events[Event]>) {
        return this.controller.createEvent({ action, name: name as string })
    }

    removeListener(code: number) {
        this.controller.removeEvent(code)
    }
}
