import { RelationOperatorByType } from '../constants'
import { Decorator } from '../../../decorators'

function TransformValueParams() {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            const result = originalMethod.apply(this, args)

            return result
        }
    }

    return Decorator.Create.Method(handler)
}

export class OperatorBooleanFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['Boolean']]?: (value: any, valueOperator: any) => boolean }> = {
        equals: OperatorBooleanFunctions.equals,
        filled: OperatorBooleanFunctions.filled,
        different: OperatorBooleanFunctions.different,
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
    private static filled(value: any, valueOperator: any) {
        if (valueOperator) {
            return !!value
        }
        return typeof value == 'undefined' || !value
    }
}
