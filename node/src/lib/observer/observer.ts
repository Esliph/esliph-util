import { randomIdIntWithDate } from '../random'
import { Event, EventModel, ActionModel } from './event'
import { ObserverEventRepository } from './observer.repository'

export type EventsObserver = {
    [x: string]: any
}

export type EventAction = ActionModel
export type EventCreateArgs = Omit<EventModel, 'code'>
export type EventPerformActionEventArgs = EventModel['eventName']
export type EventDeleteEventArgs = EventModel['code']

export class Observer {
    private static repository: ObserverEventRepository = new ObserverEventRepository({ isolated: true })

    // # Use Case
    on(args: EventCreateArgs) {
        return this.performCreateEvent(args)
    }

    emit(eventName: EventModel['eventName'], data: any, req?: any) {
        this.performEmitEventsByName(eventName, data, req)
    }

    deleteEvent(code: EventDeleteEventArgs) {
        this.performDeleteEvent(code)
    }

    getEventByEventName(eventName: string) {
        return this.repository.findEventByEventName(eventName)
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
    private performEmitEventsByName(eventName: EventModel['eventName'], data: any, req?: any) {
        const events = this.repository.findEventsByEventName(eventName)

        events.map(event => setTimeout(() => this.performEvent(event, data, req), 1))
    }

    performEvent(event: Event, data: any, req: any = {}) {
        const response = event.performAction(data, req)

        return response
    }

    private performEmitEventByName(eventName: EventModel['eventName'], data: any) {
        const event = this.repository.findEventByEventName(eventName)

        if (!event) {
            return null
        }

        return event.action(data)
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
