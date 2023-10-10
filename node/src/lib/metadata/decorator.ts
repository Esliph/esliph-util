import { Decorator, DecoratorOptions, ClassDecoratorType, AttributeDecoratorType, ParameterDecoratorType, MethodDecoratorType } from '../decorators'
import { Metadata } from './controller'
import 'reflect-metadata'

export type DecoratorMetadataOptions = DecoratorOptions & { value: any | ((...args: any[]) => any) }

export class DecoratorMetadata {
    private constructor() {}

    static Create = {
        Class: (options: Partial<DecoratorMetadataOptions> = {}, ...handlers: ClassDecoratorType[]) =>
            Decorator.Create.Class(
                constructor =>
                    Metadata.Create.Class(
                        {
                            key: options.key || 'default:class',
                            value: typeof options.value != 'function' ? options.value : options.value(constructor),
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
                            key: options.key || 'default:attribute',
                            value: typeof options.value != 'function' ? options.value : options.value(target, key),
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
                            key: options.key || 'default:method',
                            value: typeof options.value != 'function' ? options.value : options.value(target, key),
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
                            key: options.key || 'default:parameter',
                            value: typeof options.value != 'function' ? options.value : options.value(target, propertyKey, parameterIndex),
                            index: parameterIndex,
                        },
                        target,
                        propertyKey
                    ),
                ...handlers
            ),
    }
}
