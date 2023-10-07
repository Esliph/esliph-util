import { ModelSchema, ModelSchemaOptions } from '../../repository-memory'
import { RouterModelArgs } from '../model'

export class ServerRepository extends ModelSchema<RouterModelArgs> {
    constructor(options?: ModelSchemaOptions) {
        super('_ServerListener', options)
    }
}
