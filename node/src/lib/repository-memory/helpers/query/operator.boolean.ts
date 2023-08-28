import { RelationOperatorByType } from '../constants'

export class OperatorBooleanFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['Boolean']]?: (value: any, valueOperator: any) => boolean }> = {
        equals: OperatorBooleanFunctions.equals,
        filled: OperatorBooleanFunctions.filled,
        different: OperatorBooleanFunctions.different,
    }

    @OperatorBooleanFunctions.TransformValueParams()
    private static equals(value: any, valueOperator: any) {
        return value == valueOperator
    }

    @OperatorBooleanFunctions.TransformValueParams()
    private static different(value: any, valueOperator: any) {
        return value != valueOperator
    }

    @OperatorBooleanFunctions.TransformValueParams()
    private static filled(value: any, valueOperator: any) {
        if (valueOperator) {
            return !!value
        }
        return typeof value == 'undefined' || !value
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
