import { ObserverListener } from '../observers/observer-listener'
import { Decorator } from './../../decorators'

const observerListener = new ObserverListener({})

export function OnEvent(eventName: string, context = '') {
    function handler(target: any, key: string, descriptor: PropertyDescriptor) {
        observerListener.on(eventName, descriptor.value, context)
    }

    return Decorator.Create.Method(handler)
}
