import { ModelSchema, ModelSchemaOptions } from '../repository-memory'
import { EventModelArgs } from './model'

export class ObserverRepository extends ModelSchema<EventModelArgs> {
    constructor(options?: ModelSchemaOptions) {
        super('_Observer', options)
    }
}
