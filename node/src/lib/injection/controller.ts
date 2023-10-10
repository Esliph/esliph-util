import { ClassConstructor, DecoratorMetadata } from '../metadata'

export class Injection {
    static Injectable = Injectable
    static Inject = Inject
    static resolve(classConstructor: ClassConstructor) {}
}

function Injectable(key: string) {
    return DecoratorMetadata.Create.Class(
        { key: 'class.injectable', value: true },
        DecoratorMetadata.Create.Class({
            key: `class.injectable.${key}`,
            value: (constructor: any) => constructor,
        })
    )
}

function Inject(key: string) {
    return DecoratorMetadata.Create.Parameter({ key: `param.inject.${key}` })
}
