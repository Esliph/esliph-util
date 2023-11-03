import { RelationOperatorByType } from '../constants'
import { Decorator } from '../../../decorators'

function TransformValueParams() {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
       const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            args = [`${args[0]}`, `${args[1]}`]

            const result = originalMethod.apply(this, args)

            return result
        }
    }

    return Decorator.Create.Method(handler)
}

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

    @TransformValueParams()
    private static contains(value: any, valueOperator: any) {
        return value.includes(valueOperator)
    }

    @TransformValueParams()
    private static notContains(value: any, valueOperator: any) {
        return !value.includes(valueOperator)
    }

    @TransformValueParams()
    private static equals(value: any, valueOperator: any) {
        return value == valueOperator
    }

    @TransformValueParams()
    private static different(value: any, valueOperator: any) {
        return value != valueOperator
    }

    @TransformValueParams()
    private static startsWith(value: any, valueOperator: any) {
        return value.startsWith(valueOperator)
    }

    @TransformValueParams()
    private static endsWith(value: any, valueOperator: any) {
        return value.endsWith(valueOperator)
    }

    @TransformValueParams()
    private static filled(value: any, valueOperator: any) {
        if (valueOperator) {
            return !!value
        }
        return typeof value == 'undefined' || !value
    }
}
