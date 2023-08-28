import { ModelSchema, ModelSchemaOptions } from '../repository-memory'
import { Event, EventModel } from './event'

export class ObserverEventRepository extends ModelSchema<Event> {
    constructor(options?: ModelSchemaOptions) {
        super('_ObserverEvents', options)
    }

    public deleteByCode(code: EventModel['code']) {
        return this.delete({ where: { code: { equals: code } } })
    }

    public findEventsByEventName(eventName: EventModel['eventName']) {
        return this.findMany({ where: { eventName: { equals: eventName } } })
    }

    public findEventsByCode(code: EventModel['code']) {
        return this.findMany({ where: { code: { equals: code } } })
    }
}