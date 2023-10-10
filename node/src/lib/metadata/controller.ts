import { DecoratorOptions } from '../decorators'
import 'reflect-metadata'

export type ClassConstructor = new (...args: any[]) => any

export class Metadata {
    private constructor() {}

    static Create = {
        Class: (options: DecoratorOptions, constructor: any) => Reflect.defineMetadata(options.key, options.value || null, constructor),
        Attribute: (options: DecoratorOptions, target: any, key: string) => Reflect.defineMetadata(options.key, options.value || null, target, key),
        Method: (options: DecoratorOptions, target: any, key: string) => Reflect.defineMetadata(options.key, options.value || null, target, key),
        Parameter: (options: DecoratorOptions & { index: number }, target: any, key: string) =>
            Reflect.defineMetadata(`${options.key}:${options.index}`, options.value || null, target, key),
    }

    static Get = {
        Class: <T>(key: string, classConstructor: ClassConstructor) => Reflect.getMetadata(key, classConstructor) as T,
        Attribute: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Reflect.getMetadata(key, classConstructor.prototype, keyProperty) as T,
        Method: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Reflect.getMetadata(key, classConstructor.prototype, keyProperty) as T,
        Parameter: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Reflect.getMetadata(key, classConstructor.prototype, keyProperty) as T,
    }
}
