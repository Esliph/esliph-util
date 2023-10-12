import { ClassConstructor, DecoratorMetadata, Metadata } from '../metadata'
import { Decorator } from '../decorators'
import { InjectionRepository } from './repository'

export class Injection {
    static Injectable = Injectable
    static InjectableService = AddService
    static Inject = Inject
    static getInstance = getInstance
    static resolve<T extends ClassConstructor>(classConstructor: T) {
        return Resolve<T>(classConstructor)
    }
}

function Injectable(key?: string) {
    const handler = key
        ? (constructor: any) => {
            AddService(key, constructor)

            return DecoratorMetadata.Create.Class({
                key: `class.injectable.${key}`,
                value: (constructor: any) => constructor,
            })
        }
        : () => { }

    return DecoratorMetadata.Create.Class({ key: 'class.injectable', value: true }, handler)
}

function AddService(key: string, service: ClassConstructor) {
    InjectionRepository.add(key, service)
}

function Inject(key: string) {
    function handler(target: any, propertyKey?: string | symbol, parameterIndex?: number) {
        if (typeof target.prototype.Injections == 'undefined') {
            target.prototype.Injections = {}
        }

        if (typeof parameterIndex == 'undefined') {
            throw new Error(`Parameter in ${target.name} cannot be undefined`)
        }

        target.prototype.Injections[parameterIndex] = key
    }

    return Decorator.Create.Parameter(handler)
}

function Resolve<T extends ClassConstructor>(classConstructor: T): InstanceType<T> {
    if (!Metadata.Get.Class('class.injectable', classConstructor)) {
        throw new Error(`Class ${classConstructor.name} need decorate Injectable`)
    }

    if (typeof classConstructor.prototype.Injections == 'undefined' || !Object.keys(classConstructor.prototype.Injections).length) {
        return new classConstructor()
    }

    const instances: { index: number; value: InstanceType<ClassConstructor<any>> | null; service: ClassConstructor<any> }[] = Object.keys(
        classConstructor.prototype.Injections
    ).map(index => {
        const serviceName = classConstructor.prototype.Injections[index]

        return { index: Number(index), service: InjectionRepository.get(serviceName), value: null }
    })

    const instancesOrdered = instances.sort((a, b) => a.index - b.index)

    instancesOrdered.map(({ service }, i) => {
        instancesOrdered[i].value = Resolve(service)
    })

    return new classConstructor(...instancesOrdered.map(({ value }) => value))
}

function getInstance<T>(key: string) {
    const Instance = InjectionRepository.get<T>(key)

    if (typeof Instance == 'undefined') {
        throw new Error(`Service name ${key} not found`)
    }

    return Resolve(Instance)
}