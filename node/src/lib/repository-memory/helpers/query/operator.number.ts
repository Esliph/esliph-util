import { RelationOperatorByType } from '../constants'
import { Decorator } from '../../../decorators'

function TransformValueParams(config?: { toString?: boolean }) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            if (config?.toString) {
                args[0] = `${args[0]}`
                args[1] = `${args[1]}`
            } else {
                args[0] = Number(args[0])
                args[1] = Number(args[1])
                if (isNaN(args[0]) || isNaN(args[1])) {
                    return false
                }
            }

            const result = originalMethod.apply(this, args)

            return result
        }
    }

    return Decorator.Create.Method(handler)
}

export class OperatorNumberFunctions {
    static readonly OPERATORS_FUNCTION: Partial<{ [x in keyof (typeof RelationOperatorByType)['Number']]?: (value: any, valueOperator: any) => boolean }> = {
        equals: OperatorNumberFunctions.equals,
        different: OperatorNumberFunctions.different,
        filled: OperatorNumberFunctions.filled,
        startsWith: OperatorNumberFunctions.startsWith,
        endsWith: OperatorNumberFunctions.endsWith,
        contains: OperatorNumberFunctions.contains,
        notContains: OperatorNumberFunctions.notContains,
        biggerOrEqualsThat: OperatorNumberFunctions.biggerOrEqualsThat,
        lessOrEqualsThat: OperatorNumberFunctions.lessOrEqualsThat,
        biggerThat: OperatorNumberFunctions.biggerThat,
        lessThat: OperatorNumberFunctions.lessThat,
        between: OperatorNumberFunctions.between,
    }

    @TransformValueParams()
    private static contains(value: any, valueOperator: any) {
        return value.includes(valueOperator)
    }

    @TransformValueParams()
    private static biggerOrEqualsThat(value: any, valueOperator: any) {
        return value >= valueOperator
    }

    @TransformValueParams()
    private static lessOrEqualsThat(value: any, valueOperator: any) {
        return value <= valueOperator
    }

    @TransformValueParams()
    private static biggerThat(value: any, valueOperator: any) {
        return value > valueOperator
    }

    @TransformValueParams()
    private static lessThat(value: any, valueOperator: any) {
        return value < valueOperator
    }

    private static between(value: any, valueOperator: any) {
        if (valueOperator.biggerOrEqualsThat) {
            if (!OperatorNumberFunctions.biggerOrEqualsThat(value, valueOperator.biggerOrEqualsThat)) {
                return false
            }
        }
        if (valueOperator.lessOrEqualsThat) {
            if (!OperatorNumberFunctions.lessOrEqualsThat(value, valueOperator.lessOrEqualsThat)) {
                return false
            }
        }
        return true
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

    @TransformValueParams({ toString: true })
    private static startsWith(value: any, valueOperator: any) {
        return `${value}`.startsWith(`${valueOperator}`)
    }

    @TransformValueParams({ toString: true })
    private static endsWith(value: any, valueOperator: any) {
        return `${value}`.endsWith(`${valueOperator}`)
    }

    private static filled(value: any, valueOperator: any) {
        if (valueOperator) {
            return !!`${value}`
        }
        return typeof `${value}` == 'undefined' || !`${value}`
    }
}
