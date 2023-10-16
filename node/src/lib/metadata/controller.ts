import { DecoratorOptions } from '../decorators'
import { ReflectOriginal, ReflectType } from './repository'

export type ClassConstructor<T = any> = new (...args: any[]) => T

export class Metadata {
    constructor() {}

    Create = {
        Class: (options: DecoratorOptions, constructor: any) => Metadata.CreateClass(options, constructor, this.getReflect()),
        Attribute: (options: DecoratorOptions, target: any, key: string) => Metadata.CreateAttribute(options, target, key, this.getReflect()),
        Method: (options: DecoratorOptions, target: any, key: string) => Metadata.CreateMethod(options, target, key, this.getReflect()),
        Parameter: (options: DecoratorOptions & { index?: number }, target?: any, key: string | symbol = '') =>
            Metadata.CreateParameter(options, target, key, this.getReflect()),
    }
    Get = {
        Class: <T>(key: string, classConstructor: ClassConstructor) => Metadata.GetClass<T>(key, classConstructor, this.getReflect()),
        Attribute: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.GetAttribute<T>(key, classConstructor, keyProperty, this.getReflect()),
        Method: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.GetMethod<T>(key, classConstructor, keyProperty, this.getReflect()),
        Parameter: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, order?: number) =>
            Metadata.GetParameter<T>(key, classConstructor, keyProperty, order, this.getReflect()),
    }

    static Create = {
        Class: (options: DecoratorOptions, constructor: any) => Metadata.CreateClass(options, constructor, Metadata.getReflect()),
        Attribute: (options: DecoratorOptions, target: any, key: string) =>
            Metadata.CreateAttribute(options, target, key, Metadata.getReflect()),
        Method: (options: DecoratorOptions, target: any, key: string) => Metadata.CreateMethod(options, target, key, Metadata.getReflect()),
        Parameter: (options: DecoratorOptions & { index?: number }, target?: any, key: string | symbol = '') =>
            Metadata.CreateParameter(options, target, key, Metadata.getReflect()),
    }

    private static CreateClass = (options: DecoratorOptions, constructor: any, reflec: ReflectType) =>
        reflec.defineMetadata(Symbol.for(options.key), options.value || null, constructor)

    private static CreateAttribute = (options: DecoratorOptions, target: any, key: string, reflec: ReflectType) =>
        reflec.defineMetadata(Symbol.for(options.key), options.value || null, target, key)

    private static CreateMethod = (options: DecoratorOptions, target: any, key: string, reflec: ReflectType) =>
        reflec.defineMetadata(Symbol.for(options.key), options.value || null, target, key)

    private static CreateParameter = (options: DecoratorOptions & { index?: number }, target: any = {}, key: string | symbol = '', reflect?: ReflectType) =>
        // @ts-expect-error
        reflect.defineMetadata(Symbol.for(`${options.key}:${options.index}`), options.value || null, target, key)

    static Get = {
        Class: <T>(key: string, classConstructor: ClassConstructor) => Metadata.GetClass<T>(key, classConstructor, Metadata.getReflect()),
        Attribute: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.GetAttribute<T>(key, classConstructor, keyProperty, Metadata.getReflect()),
        Method: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string) =>
            Metadata.GetMethod<T>(key, classConstructor, keyProperty, Metadata.getReflect()),
        Parameter: <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, order?: number) =>
            Metadata.GetParameter<T>(key, classConstructor, keyProperty, order, Metadata.getReflect()),
    }

    private static GetClass = <T>(key: string, classConstructor: ClassConstructor, reflec: ReflectType) =>
        reflec.getMetadata(Symbol.for(key), classConstructor) as T

    private static GetAttribute = <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, reflec: ReflectType) =>
        reflec.getMetadata(Symbol.for(key), classConstructor.prototype, keyProperty) as T

    private static GetMethod = <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, reflec: ReflectType) =>
        reflec.getMetadata(Symbol.for(key), classConstructor.prototype, keyProperty) as T

    private static GetParameter = <T>(key: string, classConstructor: ClassConstructor, keyProperty: string, order?: number, reflect?: ReflectType) =>
        // @ts-expect-error
        reflect.getMetadata(Symbol.for(typeof order != 'undefined' ? `${key}:${order}` : `${key}`), classConstructor.prototype, keyProperty) as T

    getReflect() {
        return Metadata.getReflect()
    }

    static getReflect() {
        return ReflectOriginal
    }
}
