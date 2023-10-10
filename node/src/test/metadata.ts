import { DecoratorMetadata, Metadata } from '../lib/metadata'
import 'reflect-metadata'

function Class(value?: any) {
    return DecoratorMetadata.Create.Class({ value, key: 'class' })
}

function Attribute(value?: any) {
    return DecoratorMetadata.Create.Attribute({ value, key: 'attribute' })
}

function Method(value?: any) {
    return DecoratorMetadata.Create.Method({ value, key: 'method' })
}

function Parameter(value?: any) {
    return DecoratorMetadata.Create.Parameter({ value, key: 'param' })
}

@Class()
class ABC {
    constructor(a, @Parameter('B') b) {}
}

console.log(Reflect.getMetadata('design:paramtypes', ABC))

class MathClass {
    @LogParamTypes()
    multiply(numA: number, numB: number): number {
        return numA * numB
    }
}

function LogParamTypes() {
    return LogParamTypesFactory
}

function LogParamTypesFactory(target, propertyName, descriptor) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyName)
    console.log('paramTypes:', paramTypes)
}
