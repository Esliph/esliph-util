import { ObserverController } from '../controller'
import { Action } from '../model'
import { ObserverEvent } from './model'

export class ObserverListener<Events extends ObserverEvent = any> {
    private readonly controller: ObserverController

    constructor() {
        this.controller = new ObserverController()
    }

    on<Event extends keyof Events>(name: Event, action: Action<Events[Event]>) {
        return this.controller.createEvent({ action, name: name as string })
    }

    removeListener(code: number) {
        this.controller.removeEvent(code)
    }
}
