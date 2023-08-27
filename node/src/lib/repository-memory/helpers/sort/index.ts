import { Constants, Types } from '..'

export function sortDocuments<M extends Types.DocumentDefaultArgs>(documents: Types.Document<M>[], args: Types.OrderByArgs<Types.Document<M>>[]) {
    return documents.sort((doc1, doc2) => {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i]
            const propName = Object.keys(args[i])[0]

            const sortResult = sortData(doc1, doc2, arg, propName)

            if (sortResult != 0) {
                return sortResult
            }
        }

        return -1
    })
}

function sortData(doc1: any, doc2: any, arg: any, prop: string): number {
    if (typeof arg[prop] == 'object') {
        return sortData(doc1[prop], doc2[prop], arg[prop], Object.keys(arg[prop])[0])
    }

    if (arg[prop] == Constants.OrderBy.ASC) {
        return sortPropData(doc1[prop], doc2[prop])
    }

    return sortPropData(doc2[prop], doc1[prop])
}

function sortPropData(val1: any, val2: any) {
    if (typeof val1 == 'undefined') {
        return 1
    }

    if (typeof val2 == 'undefined') {
        return -1
    }

    if (typeof val1 == 'number') {
        return val1 - val2
    }

    if (val1 instanceof Date) {
        // @ts-expect-error
        return val1 - val2
    }

    if (typeof val1 == 'string') {
        return val1.localeCompare(val2)
    }

    return val1 - val2
}
