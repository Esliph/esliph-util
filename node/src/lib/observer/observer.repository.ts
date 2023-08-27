import { ModelSchema, ModelSchemaOptions } from '../repository-memory'
import { Event, EventModel } from './event'

export class ObserverEventRepository extends ModelSchema<Event> {
    constructor(options?: ModelSchemaOptions) {
        super('_ObserverEvents', options)
    }

    public findEventsByEventName(eventName: EventModel['eventName']) {
        return this.findMany({ where: { eventName: { equals: eventName } }, orderBy: [{ order: 'ASC' }, { id: 'ASC' }] })
    }
}