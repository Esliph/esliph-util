import { randomIdIntWithDate } from '../random'
import { Event, EventModel, ActionModel } from './event'
import { ObserverEventRepository } from './observer.repository'

export type EventsObserver = { [x: string]: any }

export type EventCreateArgs = Omit<EventModel, 'code'>
export type EventPerformActionEventArgs = EventModel['eventName']
export type EventAction<Data> = ActionModel<Data>

export class Observer {
    private static repository: ObserverEventRepository = new ObserverEventRepository({ isolated: true })

    // # Use Case
    on(args: EventCreateArgs) {
        this.performCreateEvent(args)
    }

    emit(eventName: EventModel['eventName'], data: any) {
        this.performEmitEventByName(eventName, data)
    }

    // # Operacional
    // ## Create
    private performCreateEvent({ action, eventName, order }: EventCreateArgs) {
        const event = this.createEvent({ action, eventName, order })

        this.insertInRepository(event)
    }

    private createEvent({ action, eventName, order }: EventCreateArgs) {
        const code = randomIdIntWithDate()

        const event = new Event({ action, eventName, order, code })

        return event
    }

    private performEmitEventByName(eventName: EventModel['eventName'], data: any) {
        const events = this.repository.findEventsByEventName(eventName)

        console.log(events)
    }

    // Repository
    private insertInRepository(event: Event) {
        this.repository.create({ data: event })
    }

    // # Attributes
    private get repository() {
        return Observer.repository
    }
}