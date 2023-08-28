import { randomIdIntWithDate } from '../random'
import { Event, EventModel, ActionModel } from './event'
import { ObserverEventRepository } from './observer.repository'

export type EventsObserver = { [x: string]: any }

export type EventAction<Data> = ActionModel<Data>
export type EventCreateArgs = Omit<EventModel, 'code'>
export type EventPerformActionEventArgs = EventModel['eventName']
export type EventDeleteEventArgs = EventModel['code']

export class Observer {
    private static repository: ObserverEventRepository = new ObserverEventRepository({ isolated: true })

    // # Use Case
    on(args: EventCreateArgs) {
        return this.performCreateEvent(args)
    }

    emit(eventName: EventModel['eventName'], data: any) {
        this.performEmitEventByName(eventName, data)
    }

    deleteEvent(code: EventDeleteEventArgs) {
        this.performDeleteEvent(code)
    }

    // # Operacional
    // ## Create
    private performCreateEvent({ action, eventName }: EventCreateArgs) {
        const event = this.createEvent({ action, eventName })

        this.insertInRepository({ ...event, performAction: event.performAction })

        return event.code
    }

    private createEvent({ action, eventName }: EventCreateArgs) {
        const code = randomIdIntWithDate()

        const event = new Event({ action, eventName, code })

        return event
    }

    // ## Emit
    private performEmitEventByName(eventName: EventModel['eventName'], data: any) {
        const events = this.repository.findEventsByEventName(eventName)

        events.map(event => setTimeout(() => event.performAction(data), 1))
    }

    // ## Delete
    private performDeleteEvent(code: EventDeleteEventArgs) {
        this.repository.deleteByCode(code)
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
