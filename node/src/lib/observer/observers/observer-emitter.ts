import { ObserverController } from '../controller'
import { ObserverRepository } from '../repository'
import { ObserverEvent } from './model'

export type ObserverEmitterOptions = {
    context: string
    isLocal: boolean
}

export class ObserverEmitter<Events extends ObserverEvent = any> {
    private readonly controllerObserver: ObserverController
    private _options: ObserverEmitterOptions

    constructor(options: Partial<ObserverEmitterOptions> = {}, repositoryLocal: ObserverRepository | null = null) {
        this.controllerObserver = new ObserverController(repositoryLocal)
        this._options = {
            context: options.context || '',
            isLocal: !!options.isLocal,
        }
    }

    async emit<Event extends keyof Events>(name: Event, data: Events[Event], context = this._options.context) {
        await this.controllerObserver.performEvent(name as string, data, context)
    }
}
