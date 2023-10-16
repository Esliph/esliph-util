import { Decorator, DecoratorOptions, ClassDecoratorType, AttributeDecoratorType, ParameterDecoratorType, MethodDecoratorType } from '../decorators'
import { Metadata } from './controller'

export type DecoratorMetadataOptions = DecoratorOptions & { value: any | ((...args: any[]) => any) }

export enum DEFAULT_KEYS {
    CLASS = 'default:class',
    ATTRIBUTE = 'default:attribute',
    METHOD = 'default:method',
    PARAMETER = 'default:parameter',
}

export class DecoratorMetadata {
    private constructor() {}

    static Create = {
        Class: (options: Partial<DecoratorMetadataOptions> = {}, ...handlers: ClassDecoratorType[]) =>
            Decorator.Create.Class(
                constructor =>
                    Metadata.Create.Class(
                        {
                            key: options.key || DEFAULT_KEYS.CLASS,
                            value: DecoratorMetadata.getValue(options.value, constructor),
                        },
                        constructor
                    ),
                ...handlers
            ),
        Attribute: (options: Partial<DecoratorMetadataOptions> = {}, ...handlers: AttributeDecoratorType[]) =>
            Decorator.Create.Attribute(
                (target, key) =>
                    Metadata.Create.Attribute(
                        {
                            key: options.key || DEFAULT_KEYS.ATTRIBUTE,
                            value: DecoratorMetadata.getValue(options.value, target, key),
                        },
                        target,
                        key
                    ),
                ...handlers
            ),
        Method: (options: Partial<DecoratorMetadataOptions> = {}, ...handlers: MethodDecoratorType[]) =>
            Decorator.Create.Method(
                (target, key) =>
                    Metadata.Create.Method(
                        {
                            key: options.key || DEFAULT_KEYS.METHOD,
                            value: DecoratorMetadata.getValue(options.value, target, key),
                        },
                        target,
                        key
                    ),
                ...handlers
            ),
        Parameter: (options: Partial<DecoratorMetadataOptions> = {}, ...handlers: ParameterDecoratorType[]) =>
            Decorator.Create.Parameter(
                (target, propertyKey, parameterIndex) =>
                    Metadata.Create.Parameter(
                        {
                            key: options.key || DEFAULT_KEYS.PARAMETER,
                            value: DecoratorMetadata.getValue(options.value, target, propertyKey, parameterIndex),
                            index: parameterIndex,
                        },
                        target,
                        propertyKey
                    ),
                ...handlers
            ),
    }

    private static getValue(value: any | ((...args: any[]) => any), ...args: any[]) {
        return typeof value != 'function' ? value : value(...args)
    }
}
