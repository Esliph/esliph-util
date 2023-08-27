import { Observer, EventsObserver, EventCreateArgs, EventAction } from './observer'

export class ObserverEvent<Events extends EventsObserver = any> {
    protected observer: Observer

    constructor() {
        this.observer = new Observer()
    }

    on<EventName extends keyof Events>(eventName: EventName, action: EventAction<Events[EventName]>, order?: EventCreateArgs['order']) {
        this.observer.on({ action, eventName, order } as EventCreateArgs)
    }

    emit<EventName extends keyof Events>(eventName: EventName, data: Events[EventName]) {
        this.observer.emit(eventName as string, data)
    }
}