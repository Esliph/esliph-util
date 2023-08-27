import { Types, validQueryToDocument } from './helpers'
import { createDocument } from './helpers/create'
import { limitDocumentsResult } from './helpers/limit'
import { sortDocuments } from './helpers/sort'
import {
    CreateManyResponse,
    CreateResponse,
    DeleteManyResponse,
    DeleteResponse,
    FindFirstResponse,
    FindIndexResponse,
    FindManyIndexResponse,
    FindManyResponse,
    UpdateManyResponse,
    UpdateResponse,
} from './helpers/types.model'
import { deepClone, deepMerge } from './util'

export class Repository {
    private models: Types.ModelsRepository

    constructor() {
        this.models = {}
    }

    // # Use Cases
    @Repository.ValidModelName()
    create<M extends Types.DocumentDefaultArgs>(name: string, args: Types.CreateArgs<M>): CreateResponse<M> {
        return this.createAndPerformInsertDocument(name, args)
    }
    @Repository.ValidModelName()
    createMany<M extends Types.DocumentDefaultArgs>(name: string, args: Types.CreateManyArgs<M>): CreateManyResponse<M> {
        return args.data.map(arg => this.createAndPerformInsertDocument(name, { data: arg }))
    }

    @Repository.ValidModelName()
    update<M extends Types.DocumentDefaultArgs>(name: string, args: Types.UpdateArgs<M>): UpdateResponse<M> {
        this.updateDocumentsByIndexes(name, [this.getIndexDocumentFiltered(name, args.where)], args.data)
    }

    @Repository.ValidModelName()
    updateMany<M extends Types.DocumentDefaultArgs>(name: string, args: Types.UpdateManyArgs<M>): UpdateManyResponse<M> {
        this.updateDocumentsByIndexes(name, this.getIndexesDocumentsFiltered(name, args.where), args.data)
    }

    @Repository.ValidModelName()
    delete<M extends Types.DocumentDefaultArgs>(name: string, args: Types.DeleteArgs<M>): DeleteResponse<M> {
        if (!Object.keys(args.where).length) {
            return
        }

        const index = this.getIndexDocumentFiltered<M>(name, args.where)

        this.deleteDocumentByIndex(name, index)
    }

    @Repository.ValidModelName()
    deleteMany<M extends Types.DocumentDefaultArgs>(name: string, args: Types.DeleteManyArgs<M>): DeleteManyResponse<M> {
        if (!Object.keys(args.where).length) {
            return
        }

        const indexes = this.getIndexesDocumentsFiltered<M>(name, args.where).sort((i, j) => j - i)

        indexes.map(i => this.deleteDocumentByIndex(name, i))
    }

    @Repository.ValidModelName()
    findFirst<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindFirstArgs<Types.Document<M>>): FindFirstResponse<M> {
        if (!Object.keys(args.where).length) {
            return null
        }

        return this.getDocumentFiltered<M>(name, args.where)
    }

    @Repository.LimitDocumentsResult()
    @Repository.SortDocumentsResult()
    @Repository.ValidModelName()
    findMany<M extends Types.DocumentDefaultArgs>(name: string, args?: Types.FindManyArgs<Types.Document<M>>): FindManyResponse<M> {
        if (typeof args == 'undefined' || !Object.keys(args.where || {}).length) {
            return this.getAllDocuments<M>(name)
        }

        return this.getDocumentsFiltered(name, args.where || {})
    }

    @Repository.ValidModelName()
    findIndex<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindIndexArgs<Types.Document<M>>): FindIndexResponse {
        if (!Object.keys(args.where).length) {
            return -1
        }

        return this.getIndexDocumentFiltered<M>(name, args.where)
    }

    @Repository.LimitDocumentsResult()
    @Repository.ValidModelName()
    findManyIndex<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindManyIndexArgs<Types.Document<M>>): FindManyIndexResponse {
        if (!Object.keys(args.where).length) {
            return []
        }

        return this.getIndexesDocumentsFiltered<M>(name, args.where)
    }

    // # Operational
    // ## Create
    private createAndPerformInsertDocument<M extends Types.DocumentDefaultArgs>(name: string, args: Types.CreateArgs<M>) {
        const id = this.updateAndGetLastId(name)
        const document = createDocument(args, id)
        this.insertDocumentInModel(name, document)

        return document
    }

    private insertDocumentInModel<M extends Types.DocumentDefaultArgs>(name: string, doc: Types.Document<M>) {
        this.models[name].documents.push(doc)
    }

    // ## Query
    private getDocumentsFiltered<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindDefaultArgs<Types.Document<M>>) {
        return this.getAllDocuments<M>(name).filter(doc => validQueryToDocument<M>(doc, args))
    }

    private getDocumentFiltered<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindDefaultArgs<Types.Document<M>>) {
        return this.getAllDocuments<M>(name).find(doc => validQueryToDocument<M>(doc, args)) || null
    }

    private getIndexDocumentFiltered<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindDefaultArgs<Types.Document<M>>) {
        return this.getAllDocuments<M>(name).findIndex(doc => validQueryToDocument<M>(doc, args))
    }

    private getIndexesDocumentsFiltered<M extends Types.DocumentDefaultArgs>(name: string, args: Types.FindDefaultArgs<Types.Document<M>>) {
        return this.getAllDocuments<M>(name).reduce<number[]>((acc, doc, i) => {
            if (validQueryToDocument<M>(doc, args)) {
                acc.push(i)
            }

            return acc
        }, [])
    }

    @Repository.ValidModelName()
    @Repository.DeepClone()
    private getAllDocuments<M extends Types.DocumentDefaultArgs>(name: string) {
        const documents = (this.models[name].documents || []) as Types.Document<M>[]

        return documents
    }

    // ## Update
    @Repository.ValidModelName()
    private updateDocumentsByIndexes<M extends Types.DocumentDefaultArgs>(name: string, indexes: number[], data: Types.UpdateDataDefaultArgs<M>) {
        return indexes.map(
            i => deepMerge(this.models[name].documents[i], this.models[name].documents[i], data, { updateAt: new Date(Date.now()) }) as Types.Document<M>
        )
    }

    // ## Delete
    @Repository.ValidModelName()
    private deleteDocumentByIndex(name: string, index: number) {
        if (index < 0) {
            return
        }

        this.models[name].documents.splice(index, 1)
    }

    // # Index ID
    private updateAndGetLastId(name: string) {
        this.updateLastId(name)
        const lastId = this.getLastIdAvailable(name)

        return lastId
    }

    private updateLastId(name: string) {
        this.models[name].lastId++
    }

    private getLastIdAvailable(name: string) {
        return this.models[name].lastId
    }

    // # Utils
    private static ValidModelName(orderParam = 0) {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                const modelName = args[orderParam] || {}

                const result = originalMethod.apply(this, args)

                return result
            }

            return descriptor
        }
    }

    private static DeepClone() {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                const result = originalMethod.apply(this, args)

                if (!result) {
                    return result
                }

                return deepClone(result)
            }

            return descriptor
        }
    }

    // ## Sort
    private static SortDocumentsResult(orderParam = 1) {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                let { orderBy } = args[orderParam] || {}

                const result = originalMethod.apply(this, args)

                if (!Array.isArray(result)) {
                    return result
                }

                if (!Array.isArray(orderBy)) {
                    orderBy = [orderBy]
                }

                return sortDocuments(result, orderBy || [{ id: 'DESC' }])
            }

            return descriptor
        }
    }

    // ## Limit
    private static LimitDocumentsResult(orderParam = 1) {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                const { limit } = args[orderParam] || {}

                const result = originalMethod.apply(this, args)

                if (!Array.isArray(result) || typeof limit != 'number' || limit < 0) {
                    return result
                }

                return limitDocumentsResult(result, limit)
            }

            return descriptor
        }
    }

    // # Model
    addModel(name: string) {
        this.models[name] = {
            documents: [],
            lastId: 0,
        }
    }

    getModel(name: string) {
        return this.models[name] || null
    }

    getModels() {
        return this.models
    }

    modelExists(name: string) {
        return !!this.models[name]
    }
}
