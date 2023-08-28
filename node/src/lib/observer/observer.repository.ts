import { ModelSchema, ModelSchemaOptions } from '../repository-memory'
import { Event, EventModel } from './event'

export class ObserverEventRepository extends ModelSchema<EventModel> {
    constructor(options?: ModelSchemaOptions) {
        super('_ObserverEvents', options)
    }

    public deleteByCode(code: EventModel['code']) {
        return this.delete({ where: { code: { equals: code } } })
    }

    public findEventsByEventName(eventName: EventModel['eventName']) {
        return this.findMany({ where: { eventName: { equals: eventName } } }).map(evt => new Event(evt))
    }

    public findEventsByCode(code: EventModel['code']) {
        return this.findMany({ where: { code: { equals: code } } }).map(evt => new Event(evt))
    }
}
