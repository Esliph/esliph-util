import { RelationOperatorByType } from '../constants'

export class OperatorStringFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['String']]?: (value: any, valueOperator: any) => boolean }> = {
        equals: OperatorStringFunctions.equals,
        filled: OperatorStringFunctions.filled,
        different: OperatorStringFunctions.different,
        startsWith: OperatorStringFunctions.startsWith,
        endsWith: OperatorStringFunctions.endsWith,
        contains: OperatorStringFunctions.contains,
        notContains: OperatorStringFunctions.notContains,
    }

    @OperatorStringFunctions.TransformValueParams()
    private static contains(value, valueOperator) {
        return value.includes(valueOperator)
    }

    @OperatorStringFunctions.TransformValueParams()
    private static notContains(value, valueOperator) {
        return !value.includes(valueOperator)
    }

    @OperatorStringFunctions.TransformValueParams()
    private static equals(value, valueOperator) {
        return value == valueOperator
    }

    @OperatorStringFunctions.TransformValueParams()
    private static different(value, valueOperator) {
        return value != valueOperator
    }

    @OperatorStringFunctions.TransformValueParams()
    private static startsWith(value, valueOperator) {
        return value.startsWith(valueOperator)
    }

    @OperatorStringFunctions.TransformValueParams()
    private static endsWith(value, valueOperator) {
        return value.endsWith(valueOperator)
    }

    @OperatorStringFunctions.TransformValueParams()
    private static filled(value, valueOperator) {
        if (valueOperator) {
            return !!value
        }
        return typeof value == 'undefined' || !value
    }

    private static TransformValueParams() {
        return function (target, property, descriptor) {
            const originalMethod = descriptor.value

            descriptor.value = function (...args: any[]) {
                args = [`${args[0]}`, `${args[1]}`]

                const result = originalMethod.apply(this, args)

                return result
            }

            return descriptor
        }
    }
}
