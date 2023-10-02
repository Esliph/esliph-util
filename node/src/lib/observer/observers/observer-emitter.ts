import { ObserverController } from '../controller'
import { ObserverEvent } from './model'

export class ObserverEmitter<Events extends ObserverEvent = any> {
    private readonly controller: ObserverController

    constructor() {
        this.controller = new ObserverController()
    }

    async emit<Event extends keyof Events>(name: Event, data: Events[Event]) {
        await this.controller.performEvent(name as string, data)
    }
}
