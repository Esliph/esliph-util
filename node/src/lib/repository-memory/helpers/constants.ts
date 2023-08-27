export enum OrderBy {
    'ASC' = 'ASC',
    'DESC' = 'DESC',
}
export enum Operators {
    'AND' = 'AND',
    'OR' = 'OR',
    'NOT' = 'NOT',
}
export enum OperatorsProps {
    'equals' = 'equals',
    'different' = 'different',
    'startsWith' = 'startsWith',
    'endsWith' = 'endsWith',
    'filled' = 'filled',
    'contains' = 'contains',
    'notContains' = 'notContains',
    'biggerThat' = 'biggerThat',
    'biggerOrEqualsThat' = 'biggerOrEqualsThat',
    'lessThat' = 'lessThat',
    'lessOrEqualsThat' = 'lessOrEqualsThat',
    'between' = 'between',
    'has' = 'has',
    'hasNot' = 'hasNot',
    'hasEvery' = 'hasEvery',
    'hasSome' = 'hasSome',
    'hasNotEvery' = 'hasNotEvery',
    'hasNotSome' = 'hasNotSome',
    'isEmpty' = 'isEmpty',
    'count' = 'count',
}
export const RelationOperatorByType = {
    String: {
        [OperatorsProps.equals]: OperatorsProps.equals,
        [OperatorsProps.different]: OperatorsProps.different,
        [OperatorsProps.startsWith]: OperatorsProps.startsWith,
        [OperatorsProps.endsWith]: OperatorsProps.endsWith,
        [OperatorsProps.filled]: OperatorsProps.filled,
        [OperatorsProps.contains]: OperatorsProps.contains,
        [OperatorsProps.notContains]: OperatorsProps.notContains,
    },
    Number: {
        [OperatorsProps.equals]: OperatorsProps.equals,
        [OperatorsProps.different]: OperatorsProps.different,
        [OperatorsProps.startsWith]: OperatorsProps.startsWith,
        [OperatorsProps.endsWith]: OperatorsProps.endsWith,
        [OperatorsProps.filled]: OperatorsProps.filled,
        [OperatorsProps.biggerThat]: OperatorsProps.biggerThat,
        [OperatorsProps.biggerOrEqualsThat]: OperatorsProps.biggerOrEqualsThat,
        [OperatorsProps.lessThat]: OperatorsProps.lessThat,
        [OperatorsProps.lessOrEqualsThat]: OperatorsProps.lessOrEqualsThat,
        [OperatorsProps.contains]: OperatorsProps.contains,
        [OperatorsProps.notContains]: OperatorsProps.notContains,
        [OperatorsProps.between]: OperatorsProps.between,
    },
    Boolean: {
        [OperatorsProps.equals]: OperatorsProps.equals,
        [OperatorsProps.different]: OperatorsProps.different,
        [OperatorsProps.filled]: OperatorsProps.filled,
    },
    Date: {
        [OperatorsProps.equals]: OperatorsProps.equals,
        [OperatorsProps.different]: OperatorsProps.different,
        [OperatorsProps.filled]: OperatorsProps.filled,
        [OperatorsProps.biggerThat]: OperatorsProps.biggerThat,
        [OperatorsProps.biggerOrEqualsThat]: OperatorsProps.biggerOrEqualsThat,
        [OperatorsProps.lessThat]: OperatorsProps.lessThat,
        [OperatorsProps.lessOrEqualsThat]: OperatorsProps.lessOrEqualsThat,
        [OperatorsProps.between]: OperatorsProps.between,
    },
    Array: {
        [OperatorsProps.has]: OperatorsProps.has,
        [OperatorsProps.hasNot]: OperatorsProps.hasNot,
        [OperatorsProps.startsWith]: OperatorsProps.startsWith,
        [OperatorsProps.endsWith]: OperatorsProps.endsWith,
        [OperatorsProps.hasEvery]: OperatorsProps.hasEvery,
        [OperatorsProps.hasSome]: OperatorsProps.hasSome,
        [OperatorsProps.hasNotEvery]: OperatorsProps.hasNotEvery,
        [OperatorsProps.hasNotSome]: OperatorsProps.hasNotSome,
        [OperatorsProps.isEmpty]: OperatorsProps.isEmpty,
        [OperatorsProps.count]: OperatorsProps.count,
    },
}