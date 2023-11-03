import { Decorator } from '../../decorators'
import { Method } from '../model'
import { Client } from '../observers/client'
import { Server, ServerOption } from '../observers/server'

const serverListener = new Server()

export function Get(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.GET, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Post(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.POST, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Put(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.PUT, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Patch(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.PATCH, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Delete(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.DELETE, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Head(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.HEAD, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}
export function Options(name: string, options: Partial<ServerOption> = {}) {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        handlerMappingMethod(Method.OPTIONS, name, options, descriptor.value)
    }

    return Decorator.Create.Method(handler)
}

function handlerMappingMethod(method: Method, name: string, options: Partial<ServerOption>, ...handlers: any[]) {
    serverListener.use(options)
    // @ts-expect-error
    serverListener[method.toString().toLowerCase()](name, ...handlers)
    serverListener.resetOptions()
}