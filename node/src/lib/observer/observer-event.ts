import { Observer, EventsObserver, EventCreateArgs, EventAction, EventDeleteEventArgs } from './observer'

export class ObserverEvent<Events extends EventsObserver = any> {
    protected observer: Observer

    constructor() {
        this.observer = new Observer()
    }

    on<EventName extends keyof Events>(eventName: EventName, action: EventAction) {
        return this.observer.on({ action, eventName } as EventCreateArgs)
    }

    emit<EventName extends keyof Events>(eventName: EventName, data: Events[EventName]) {
        this.observer.emit(eventName as string, data)
    }

    removeEvent(code: EventDeleteEventArgs) {
        this.observer.deleteEvent(code)
    }
}
