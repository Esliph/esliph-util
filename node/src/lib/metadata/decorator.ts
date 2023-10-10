import { Decorator, DecoratorOptions, ClassDecoratorType, AttributeDecoratorType, ParameterDecoratorType, MethodDecoratorType } from '../decorators'
import { Metadata } from './controller'
import 'reflect-metadata'

export class DecoratorMetadata {
    private constructor() {}

    static Create = {
        Class: (options: Partial<DecoratorOptions> = {}, ...handlers: ClassDecoratorType[]) =>
            Decorator.Create.Class(
                constructor => Metadata.Create.Class({ key: options.key || 'default:class', value: options.value || null }, constructor),
                ...handlers
            ),
        Attribute: (options: Partial<DecoratorOptions> = {}, ...handlers: AttributeDecoratorType[]) =>
            Decorator.Create.Attribute(
                (target, key) => Metadata.Create.Attribute({ key: options.key || 'default:attribute', value: options.value || null }, target, key),
                ...handlers
            ),
        Method: (options: Partial<DecoratorOptions> = {}, ...handlers: MethodDecoratorType[]) =>
            Decorator.Create.Method(
                (target, key) => Metadata.Create.Method({ key: options.key || 'default:method', value: options.value || null }, target, key),
                ...handlers
            ),
        Parameter: (options: Partial<DecoratorOptions> = {}, ...handlers: ParameterDecoratorType[]) =>
            Decorator.Create.Parameter(
                (target, propertyKey, parameterIndex) =>
                    Metadata.Create.Parameter(
                        {
                            key: options.key || '',
                            value: options.value || null,
                            index: parameterIndex,
                        },
                        target,
                        propertyKey
                    ),
                ...handlers
            ),
    }
}
