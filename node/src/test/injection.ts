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
    @Attribute()
    abc

    @Method()
    cba(@Parameter() a, @Parameter() b) {}
}

console.log(Metadata.Get.Class('class', ABC))
console.log(Metadata.Get.Attribute('attribute', ABC, 'abc'))
console.log(Metadata.Get.Method('method', ABC, 'cba'))
console.log(Metadata.Get.Parameter('param:0', ABC, 'cba'))
console.log(Metadata.Get.Parameter('param:1', ABC, 'cba'))

const abc = new ABC()

abc.cba('A', 'B')
