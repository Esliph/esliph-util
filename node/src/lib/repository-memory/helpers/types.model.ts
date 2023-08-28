import { PartialDeep } from '../util'
import { Operators, OperatorsProps, OrderBy, RelationOperatorByType } from './constants'
import { ArrayFilter, BooleanFilter, DateFilter, DefaultFilter, NumberFilter, StringFilter } from './query'

type ReplaceTypeValueOfObjet<O extends object, V> = { [x in keyof O]: O[x] extends Date ? V : O[x] extends object ? ReplaceTypeValueOfObjet<O[x], V> : V }
type ExtractPropsInPayload<O extends object, V> = { [x in keyof O]?: O[x] extends Date ? V : O[x] extends object ? ExtractPropsInPayload<O[x], V> | V : V }
type RemovePropArray<O extends object> = { [x in keyof O]: O[x] extends Array<any> ? never : O[x] }

type GetTypeOperatorByType<T> = T extends string
    ? GetOperatorsByRelationType<'String'>
    : T extends number
    ? GetOperatorsByRelationType<'Number'>
    : T extends Array<any>
    ? GetOperatorsByRelationType<'Array'>
    : T extends Date
    ? GetOperatorsByRelationType<'Date'>
    : T extends Boolean
    ? GetOperatorsByRelationType<'Boolean'>
    : GetOperatorsByRelationType<'Default'>

export type OperatorsType = keyof typeof Operators
export type OperatorsRelationType = keyof typeof OperatorsProps
export type OperatorsPropsType = keyof typeof RelationOperatorByType
export type GetOperatorsByRelationType<Type extends OperatorsPropsType | 'Default'> = Type extends 'String'
    ? StringFilter
    : Type extends 'Number'
    ? NumberFilter
    : Type extends 'Array'
    ? ArrayFilter
    : Type extends 'Date'
    ? DateFilter
    : Type extends 'Boolean'
    ? BooleanFilter
    : Type extends 'Default'
    ? DefaultFilter
    : never

export type OrderByType = keyof typeof OrderBy

export type DocumentDefaultArgs = object
export type Document<ModelType extends DocumentDefaultArgs = {}> = ModelType & { readonly id: number; readonly createAt: Date; updateAt: Date }
export type ModelRepository = { documents: Document[]; lastId: number }
export type ModelsRepository = { [x: string]: ModelRepository }
export type ModelArgs<M extends DocumentDefaultArgs> = Document<M>
export type ModelPayloadArgs<M extends Document, S extends SelectArgs<M>> = {
    [x in keyof S]: M[x] extends Array<any> ? M[x] : M[x] extends Date ? M[x] : M[x] extends object ? ModelPayloadArgs<M[x], M[x]> : M[x]
}

export type OrderByArgs<M extends Document> = PartialDeep<RemovePropArray<ReplaceTypeValueOfObjet<M, OrderByType>>>
export type LimitArgs = number
export type SelectArgs<M extends Document> = PartialDeep<ExtractPropsInPayload<M, true>>

export type FindDefaultModelArgs<M extends object> = {
    [x in keyof M]: M[x] extends Array<any>
    ? Partial<GetTypeOperatorByType<M[x]>>
    : M[x] extends Date
    ? Partial<GetTypeOperatorByType<M[x]>>
    : M[x] extends object
    ? FindDefaultModelArgs<M[x]>
    : Partial<GetTypeOperatorByType<M[x]>>
}
export type FindOperatorsArgs<M extends Document> = FindDefaultArgs<M>[]
export type FindDefaultArgs<M extends Document> = PartialDeep<FindDefaultModelArgs<M>> & { [x in OperatorsType]?: FindOperatorsArgs<M> }
export type FindDefaultResponse<M extends Document, S extends SelectArgs<M>> = ModelPayloadArgs<M, S>
export type FindArgs<M extends Document> = { where: FindDefaultArgs<M> }
export type FindFirstArgs<M extends Document> = FindArgs<M>
export type FindFirstResponse<M extends DocumentDefaultArgs> = Document<M> | null
export type FindIndexArgs<M extends Document> = FindArgs<M>
export type FindIndexResponse = number
export type FindManyIndexArgs<M extends Document> = FindArgs<M> & { limit?: LimitArgs }
export type FindManyIndexResponse = number[]
export type FindManyArgs<M extends Document> = Partial<FindArgs<M>> & { orderBy?: OrderByArgs<M>[] | OrderByArgs<M> } & { limit?: LimitArgs }
export type FindManyResponse<M extends DocumentDefaultArgs> = Document<M>[]
export type CreateArgs<M extends DocumentDefaultArgs> = { data: M }
export type CreateResponse<M extends DocumentDefaultArgs> = Document<M>
export type CreateManyArgs<M extends DocumentDefaultArgs> = { data: M[] }
export type CreateManyResponse<M extends DocumentDefaultArgs> = Document<M>[]
export type UpdateDataDefaultArgs<M extends DocumentDefaultArgs> = PartialDeep<M>
export type UpdateArgs<M extends DocumentDefaultArgs> = FindArgs<Document<M>> & { data: UpdateDataDefaultArgs<M> }
export type UpdateResponse<M extends DocumentDefaultArgs> = void
export type UpdateManyArgs<M extends DocumentDefaultArgs> = FindArgs<Document<M>> & { data: UpdateDataDefaultArgs<M> }
export type UpdateManyResponse<M extends DocumentDefaultArgs> = void
export type DeleteArgs<M extends DocumentDefaultArgs> = FindArgs<Document<M>>
export type DeleteResponse<M extends DocumentDefaultArgs> = void
export type DeleteManyArgs<M extends DocumentDefaultArgs> = FindArgs<Document<M>>
export type DeleteManyResponse<M extends DocumentDefaultArgs> = void
