import { ObserverController } from '../controller'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export class ObserverEmitter<Events extends ObserverEvent = any> {
    private readonly controllerObserver: ObserverController

    constructor(repositoryLocal: ObserverRepository | null = null) {
        this.controllerObserver = new ObserverController(repositoryLocal)
    }

    async emit<Event extends keyof Events>(name: Event, data: Events[Event]) {
        await this.controllerObserver.performEvent(name as string, data)
    }
}
