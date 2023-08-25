export * from './operator'
import { Constants, Types } from '..'
import { OperatorsProps } from '../constants'
import { performOperatorProp } from './operator'

export function validQueryToDocument<M extends Types.DocumentDefaultArgs>(doc: Types.Document<M>, args: Types.FindDefaultArgs<Types.Document<M>>) {
    if (typeof args == 'object') {
        if (!Object.keys(args).length) {
            return false
        }
    }

    for (const prop in args) {
        const propArg = args[prop as keyof typeof Constants.Operators] as any
        const docPropArg = doc[prop as keyof typeof doc] as any

        if (isOperator(prop as keyof typeof Constants.Operators)) {
            if (!(propArg || []).length) {
                continue
            }

            if (!performOperator(prop as Types.OperatorsType, doc, propArg)) {
                return false
            }

            continue
        }

        const result = performValidConditionToDocument(docPropArg, propArg)

        if (!result) {
            return false
        }
    }

    return true
}

function isOperator(operator: keyof typeof Constants.Operators) {
    return !!Constants.Operators[operator]
}

function performOperator<M extends Types.DocumentDefaultArgs>(operator: any, doc: any, args: any[]) {
    if (args.length == 0) {
        return true
    }

    return performOperatorQueryToDocument(doc, args, operator)
}

function performOperatorQueryToDocument<M extends Types.DocumentDefaultArgs>(
    doc: Types.Document<M>,
    args: Types.FindDefaultArgs<Types.Document<M>>[],
    operator: Types.OperatorsType
) {
    for (let i = 0; i < args.length; i++) {
        const argProp = args[i]

        const result = validQueryToDocument(doc, argProp)
        const { isContinue, valueIfNotContinue } = validOperatorResult(operator, result)

        if (!isContinue) {
            return valueIfNotContinue
        }
    }

    return validOperatorInFinal(operator)
}

function validOperatorResult(operator: Types.OperatorsType, result: boolean) {
    switch (operator) {
        case Constants.Operators.AND:
            return { isContinue: result, valueIfNotContinue: false }
        case Constants.Operators.OR:
            return { isContinue: !result, valueIfNotContinue: true }
        case Constants.Operators.NOT:
            return { isContinue: !result, valueIfNotContinue: false }
        default:
            return { isContinue: false, valueIfNotContinue: false }
    }
}

function validOperatorInFinal(operator: Types.OperatorsType) {
    switch (operator) {
        case Constants.Operators.AND:
            return true
        case Constants.Operators.OR:
            return false
        case Constants.Operators.NOT:
            return true
        default:
            return false
    }
}

function performValidConditionToDocument<M extends Types.DocumentDefaultArgs>(docProp: any, argProp: any) {
    if (!(docProp instanceof Date) && !Array.isArray(docProp) && docProp != null && typeof docProp == 'object') {
        if (typeof argProp != 'object') {
            return false
        }
        for (const prop in argProp) {
            if (!performValidConditionToDocument(docProp[prop], argProp[prop])) {
                return false
            }
        }
        return true
    }

    for (const prop in argProp) {
        if (!performOperatorProp(docProp, argProp[prop], prop as keyof typeof OperatorsProps)) {
            return false
        }
    }

    return true
}
