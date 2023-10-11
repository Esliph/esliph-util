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
    abc(@Parameter('B') b: any) { }
}

console.log(Metadata.Get.Parameter('param', ABC, 'abc', 0))
