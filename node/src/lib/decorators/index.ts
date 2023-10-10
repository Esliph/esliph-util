export function ClassDecorator(constructor: any) {}
export function AttributeDecorator(target: any, key: string) {}
export function MethodDecorator(target: any, key: string, descriptor: PropertyDescriptor) {}
export function ParameterDecorator(target: any, propertyKey: string, parameterIndex: number) {}

export type ClassDecoratorType = typeof ClassDecorator
export type AttributeDecoratorType = typeof AttributeDecorator
export type MethodDecoratorType = typeof MethodDecorator
export type ParameterDecoratorType = typeof ParameterDecorator

export type DecoratorOptions = { value: any; key: string }

export class Decorator {
    private constructor() {}

    static Class = ClassDecorator
    static Attribute = AttributeDecorator
    static Method = MethodDecorator
    static Parameter = ParameterDecorator

    static Create = {
        Class: (...handlers: ClassDecoratorType[]) => {
            return (constructor: any) => {
                handlers.map(handler => handler(constructor))

                return Decorator.Class(constructor)
            }
        },
        Attribute: (...handlers: AttributeDecoratorType[]) => {
            return (target: any, key: string) => {
                handlers.map(handler => handler(target, key))

                return Decorator.Attribute(target, key)
            }
        },
        Method: (...handlers: MethodDecoratorType[]) => {
            return (target: any, key: string, descriptor: PropertyDescriptor) => {
                handlers.map(handler => handler(target, key, descriptor))

                return Decorator.Method(target, key, descriptor)
            }
        },
        Parameter: (...handlers: ParameterDecoratorType[]) => {
            return (target: any, propertyKey: string, parameterIndex: number) => {
                handlers.map(handler => handler(target, propertyKey, parameterIndex))

                return Decorator.Parameter(target, propertyKey, parameterIndex)
            }
        },
    }
}
