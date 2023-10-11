import { DecoratorOptions } from '../decorators'
import 'reflect-metadata'

export type ClassConstructor<T = any> = new (...args: any[]) => T

export class Metadata {
    private constructor() {}

    static Reflect = Reflect

    static Create = {
        Class: (options: DecoratorOptions, constructor: any) => Metadata.Reflect.defineMetadata(Symbol.for(options.key), options.value || null, constructor),
        Attribute: (options: DecoratorOptions, target: any, key: string) =>
            Metadata.Reflect.defineMetadata(Symbol.for(options.key), options.value || null, target, key),
        Method: (options: DecoratorOptions, target: any, key: string) =>
            Metadata.Reflect.defineMetadata(Symbol.for(options.key), options.value || null, target, key),
        Parameter: (options: DecoratorOptions & { index: number }, target: any, key: string) =>
            Metadata.Reflect.defineMetadata(Symbol.for(`${options.key}:${options.index}`), options.value || null, target, key),
    }

    static Get = {
        Class: <T>(key: string, classConstructor: ClassConstructor) => Metadata.Reflect.getMetadata(Symbol.for(key), classConstructor) as T,
        Attribute: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.Reflect.getMetadata(Symbol.for(key), classConstructor.prototype, keyProperty) as T,
        Method: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.Reflect.getMetadata(Symbol.for(key), classConstructor.prototype, keyProperty) as T,
        Parameter: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, order?: number) =>
            Metadata.Reflect.getMetadata(Symbol.for(typeof order != 'undefined' ? `${key}:${order}` : `${key}`), classConstructor.prototype, keyProperty) as T,
    }
}
