import { RelationOperatorByType } from '../constants'

export class OperatorArrayFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['Array']]?: (value: any, valueOperator: any) => boolean }> = {
        has: OperatorArrayFunctions.has,
        hasNot: OperatorArrayFunctions.hasNot,
        hasSome: OperatorArrayFunctions.hasSome,
        hasNotSome: OperatorArrayFunctions.hasNotSome,
        hasEvery: OperatorArrayFunctions.hasEvery,
        hasNotEvery: OperatorArrayFunctions.hasNotEvery,
        isEmpty: OperatorArrayFunctions.isEmpty,
        count: OperatorArrayFunctions.count,
        startsWith: OperatorArrayFunctions.startsWith,
        endsWith: OperatorArrayFunctions.endsWith,
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { index: 1 })
    private static hasSome(value: any, valueOperator: any) {
        for (let i = 0; i < valueOperator.length; i++) {
            if (OperatorArrayFunctions.validValudInArray(valueOperator[i], value)) {
                return true
            }
        }

        return false
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { index: 1 })
    private static hasEvery(value: any, valueOperator: any) {
        for (let i = 0; i < valueOperator.length; i++) {
            if (!OperatorArrayFunctions.validValudInArray(valueOperator[i], value)) {
                return false
            }
        }

        return true
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { index: 1 })
    private static hasNotEvery(value: any, valueOperator: any) {
        for (let i = 0; i < valueOperator.length; i++) {
            if (OperatorArrayFunctions.validValudInArray(valueOperator[i], value)) {
                return false
            }
        }

        return true
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 1 })
    private static hasNotSome(value: any, valueOperator: any) {
        for (let i = 0; i < valueOperator.length; i++) {
            if (!OperatorArrayFunctions.validValudInArray(valueOperator[i], value)) {
                return true
            }
        }

        return false
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { notArr: true, index: 1 })
    private static has(value: any, valueOperator: any) {
        return OperatorArrayFunctions.validValudInArray(valueOperator, value)
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ notArr: true, index: 1 })
    private static hasNot(value: any, valueOperator: any) {
        if (!valueOperator) {
            return false
        }

        return !OperatorArrayFunctions.validValudInArray(valueOperator, value)
    }

    @OperatorArrayFunctions.TransformValueParams()
    private static count(value: any, valueOperator: any) {
        return value.length == valueOperator
    }

    @OperatorArrayFunctions.TransformValueParams()
    private static isEmpty(value: any, valueOperator: any) {
        return valueOperator ? !value.length : !!value.length
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { index: 1 })
    private static startsWith(value: any, valueOperator: any) {
        if (value.length < valueOperator.length) {
            return false
        }

        for (let i = 0; i < valueOperator.length; i++) {
            const _value = value[i]
            const _valueOperator = valueOperator[i]

            if (_value != _valueOperator) {
                return false
            }
        }

        return true
    }

    @OperatorArrayFunctions.TransformValueParams()
    @OperatorArrayFunctions.ValidParams({ index: 0 }, { index: 1 })
    private static endsWith(value: any, valueOperator: any) {
        if (value.length < valueOperator.length) {
            return false
        }

        const _index = value.length - valueOperator.length

        for (let i = valueOperator.length - 1; i >= 0; i--) {
            const _value = value[_index + i]
            const _valueOperator = valueOperator[i]

            if (_value != _valueOperator) {
                return false
            }
        }

        return true
    }

    private static validValudInArray(value: any, arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return true
            }
        }
        return false
    }

    private static ValidParams(...params: { notArr?: boolean; index: number }[]) {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                for (let i = 0; i < params.length; i++) {
                    if (!params[i].notArr) {
                        if (!args[params[i].index].length) {
                            return false
                        }
                    } else {
                        if (typeof args[params[i].index] == 'undefined') {
                            return false
                        }
                    }
                }

                const result = originalMethod.apply(this, args)

                return result
            }

            return descriptor
        }
    }

    private static TransformValueParams() {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                const result = originalMethod.apply(this, args)

                return result
            }

            return descriptor
        }
    }
}
