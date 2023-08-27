import { Repository } from './repository'
import { Types } from './helpers'

export type ModelSchemaOptions = {
    isolated?: boolean
}

export class ModelSchema<ModelType extends Types.DocumentDefaultArgs = {}> {
    protected static readonly repository = new Repository()
    protected readonly repositoryIsolated?: Repository

    constructor(public readonly name: string, public options?: ModelSchemaOptions) {
        if (options?.isolated) {
            this.repositoryIsolated = new Repository()
        }

        this.setup()
    }

    private setup() {
        if (this.repository.modelExists(this.name)) {
            return
        }

        this.addModelInRepository()
    }

    private addModelInRepository() {
        this.repository.addModel(this.name)
    }

    create(args: Types.CreateArgs<ModelType>) {
        return this.repository.create(this.name, args)
    }

    createMany(args: Types.CreateManyArgs<ModelType>) {
        return this.repository.createMany(this.name, args)
    }

    delete(args: Types.DeleteArgs<ModelType>) {
        return this.repository.delete<ModelType>(this.name, args)
    }

    deleteMany(args: Types.DeleteManyArgs<ModelType>) {
        return this.repository.deleteMany<ModelType>(this.name, args)
    }

    update(args: Types.UpdateArgs<ModelType>) {
        return this.repository.update<ModelType>(this.name, args)
    }

    updateMany(args: Types.UpdateArgs<ModelType>) {
        return this.repository.updateMany<ModelType>(this.name, args)
    }

    findFirst(args: Types.FindFirstArgs<Types.Document<ModelType>>) {
        return this.repository.findFirst<ModelType>(this.name, args)
    }

    findMany(args?: Types.FindManyArgs<Types.Document<ModelType>>) {
        if (!args) {
            args = {}
        }

        if (!args.orderBy) {
            // @ts-expect-error
            args.orderBy = [{ id: 'DESC' }]
        } else if (Array.isArray(args.orderBy)) {
            // @ts-expect-error
            args.orderBy.push({ id: 'DESC' })
        } else if (!Object.keys(args.orderBy).length) {
            // @ts-expect-error
            args.orderBy = [{ id: 'DESC' }]
        }
        return this.repository.findMany<ModelType>(this.name, args)
    }

    findIndex(args: Types.FindIndexArgs<Types.Document<ModelType>>) {
        return this.repository.findIndex<ModelType>(this.name, args)
    }

    findManyIndex(args: Types.FindManyIndexArgs<Types.Document<ModelType>>) {
        return this.repository.findManyIndex<ModelType>(this.name, args)
    }

    protected get repository() {
        if (this.options?.isolated) { return this.repositoryIsolated as Repository }
        return ModelSchema.repository
    }
}
