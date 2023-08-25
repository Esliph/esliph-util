import { OperatorsProps, RelationOperatorByType } from '../constants'
import { OperatorStringFunctions } from './operator.string'
import { OperatorNumberFunctions } from './operator.number'
import { OperatorBooleanFunctions } from './operator.boolean'
import { OperatorDateFunctions } from './operator.date'
import { OperatorArrayFunctions } from './operator.array'

export type StringFilter = {
    equals: string
    different: string
    startsWith: string
    endsWith: string
    filled: boolean
    contains: string
    notContains: string
}
export type NumberFilter = {
    equals: number
    different: number
    startsWith: string
    endsWith: string
    filled: boolean
    biggerThat: number
    biggerOrEqualsThat: number
    lessThat: number
    lessOrEqualsThat: number
    contains: number
    notContains: number
    between: {
        biggerOrEqualsThat: number
        lessOrEqualsThat: number
    }
}
export type BooleanFilter = {
    equals: boolean
    different: boolean
    filled: boolean
}
export type DateFilter = {
    equals: Date
    different: Date
    filled: boolean
    biggerThat: Date
    biggerOrEqualsThat: Date
    lessThat: Date
    lessOrEqualsThat: Date
    between: {
        biggerOrEqualsThat: Date
        lessOrEqualsThat: Date
    }
}
export type ArrayFilter = {
    has: any
    hasNot: any
    startsWith: any[]
    endsWith: any[]
    hasEvery: any[]
    hasSome: any[]
    hasNotEvery: any[]
    hasNotSome: any[]
    isEmpty: boolean
    count: number
}
export type DefaultFilter = {
    equals: any
    different: any
    startsWith: any
    endsWith: any
    filled: any
    biggerThat: any
    biggerOrEqualsThat: any
    lessThat: any
    lessOrEqualsThat: any
    contains: any
    notContains: any
    between: {
        biggerOrEqualsThat: any
        lessOrEqualsThat: any
    }
}

export function performOperatorProp<Value, ValueOp>(value: Value, valueOperator: ValueOp, operator: keyof typeof OperatorsProps) {
    const operatorFunction = getOperatorsByType(typeof value != 'undefined' ? value : valueOperator, operator)

    if (!operatorFunction) {
        return false
    }

    return operatorFunction(value, valueOperator)
}

function getOperatorsByType(value: any, type: keyof typeof OperatorsProps) {
    const typeOfValueName: keyof typeof RelationOperatorByType = (
        !Array.isArray(value) ? (!(value instanceof Date) ? `${typeof value}`.substring(0, 1).toUpperCase() + `${typeof value}`.substring(1) : 'Date') : 'Array'
    ) as keyof typeof RelationOperatorByType

    if (!OPERATORS_TYPES[typeOfValueName]) {
        return null
    }

    // @ts-expect-error
    return OPERATORS_TYPES[typeOfValueName][type] || null
}

const OPERATORS_TYPES: {
    [x in keyof typeof RelationOperatorByType]?: Partial<{ [y in keyof (typeof RelationOperatorByType)[x]]?: (value: any, valueOperator: any) => boolean }>
} = {
    String: OperatorStringFunctions.OPERATORS_FUNCTION,
    Number: OperatorNumberFunctions.OPERATORS_FUNCTION,
    Boolean: OperatorBooleanFunctions.OPERATORS_FUNCTION,
    Date: OperatorDateFunctions.OPERATORS_FUNCTION,
    Array: OperatorArrayFunctions.OPERATORS_FUNCTION,
}
