import { RelationOperatorByType } from '../constants'
import { Decorator } from '../../../decorators'

function TransformValueParams() {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            args[0] = new Date(args[0])
            args[1] = new Date(args[1])

            console.log(args)

            const result = originalMethod.apply(this, args)

            return result
        }
    }
    return Decorator.Create.Method(handler)
}

export class OperatorDateFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['Date']]?: (value: any, valueOperator: any) => boolean }> = {
        equals: OperatorDateFunctions.equals,
        different: OperatorDateFunctions.different,
        filled: OperatorDateFunctions.filled,
        biggerOrEqualsThat: OperatorDateFunctions.biggerOrEqualsThat,
        lessOrEqualsThat: OperatorDateFunctions.lessOrEqualsThat,
        biggerThat: OperatorDateFunctions.biggerThat,
        lessThat: OperatorDateFunctions.lessThat,
        between: OperatorDateFunctions.between,
    }

    @TransformValueParams()
    private static biggerOrEqualsThat(value: any, valueOperator: any) {
        return value.getTime() >= valueOperator.getTime()
    }

    @TransformValueParams()
    private static lessOrEqualsThat(value: any, valueOperator: any) {
        return value.getTime() <= valueOperator.getTime()
    }

    @TransformValueParams()
    private static biggerThat(value: any, valueOperator: any) {
        return value.getTime() > valueOperator.getTime()
    }

    @TransformValueParams()
    private static lessThat(value: any, valueOperator: any) {
        return value.getTime() < valueOperator.getTime()
    }

    private static between(value: any, valueOperator: any) {
        if (valueOperator.biggerOrEqualsThat) {
            if (!OperatorDateFunctions.biggerOrEqualsThat(value, valueOperator.biggerOrEqualsThat)) {
                return false
            }
        }
        if (valueOperator.lessOrEqualsThat) {
            if (!OperatorDateFunctions.lessOrEqualsThat(value, valueOperator.lessOrEqualsThat)) {
                return false
            }
        }
        return true
    }

    @TransformValueParams()
    private static equals(value: any, valueOperator: any) {
        return value.getTime() == valueOperator.getTime()
    }

    @TransformValueParams()
    private static different(value: any, valueOperator: any) {
        return value.getTime() != valueOperator.getTime()
    }

    private static filled(value: any, valueOperator: any) {
        if (valueOperator) {
            return !!value
        }
        return typeof value == 'undefined' || !value
    }
}
