import { DecoratorMetadata, Metadata } from '../lib/metadata'

const metadata = new Metadata()

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

@Class('Class')
class ABC {
    abc(@Parameter('Parameter') b: any) {}
}

Metadata.Get.Class('class', ABC)
metadata.Get.Parameter('param', ABC, 'abc', 0)
