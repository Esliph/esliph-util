import { Event, EventModel, ActionModel } from './event'

export type EventsObserver = { [x: string]: any }

export type EventCreateArgs = Omit<EventModel, 'code'>
export type EventPerformActionEventArgs = EventModel['eventName']
export type EventAction<Data> = ActionModel<Data>

export class Observer {
    private static events: Event[] = []
    private static lastCode = 0

    // # Use Case
    addEvent({ action, eventName, order }: EventCreateArgs) {
        const event = this.createEvent({ action, eventName, order })

        this.events.push(event)
    }

    performActionEvent(eventName: EventModel) {

    }

    // # Operacional
    // ## Create
    private createEvent({ action, eventName, order }: EventCreateArgs) {
        const code = this.updateAndGetNewCode()

        const event = new Event({ action, eventName, order, code })

        return event
    }

    private updateAndGetNewCode() {
        this.lastCode++
        return this.lastCode
    }

    // # Attributes
    private get events() {
        return Observer.events
    }

    private get lastCode() {
        return Observer.lastCode
    }

    private set lastCode(newCode: number) {
        Observer.lastCode = newCode
    }
}