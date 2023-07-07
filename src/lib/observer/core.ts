import { ObserverListenerModuleEvent, ObserverListener } from './listener'

export class ObserverCore {
    private _listeners: ObserverListener[]

    constructor() {
        this._listeners = []
    }

    public onWithoutContext(eventName: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const listenerWithoutContext = ObserverListener.onWithoutContext(eventName, handler)

        this.addListener(listenerWithoutContext)

        return listenerWithoutContext.code
    }

    public onWithContext(eventName: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const listenerWithContext = ObserverListener.onWithContext(eventName, handler, context)

        this.addListener(listenerWithContext)

        return listenerWithContext.code
    }

    public onMainWithoutContext(eventName: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const listenerMainWithoutContext = ObserverListener.onMainWithoutContext(eventName, handler)

        this.addListener(listenerMainWithoutContext)

        return listenerMainWithoutContext.code
    }

    public onMainWithContext(eventName: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const listenerMainWithContext = ObserverListener.onMainWithContext(eventName, handler, context)

        this.addListener(listenerMainWithContext)

        return listenerMainWithContext.code
    }

    private addListener(listener: ObserverListener) {
        this.listeners.push(listener)
    }

    public async emitToContext(context: ObserverListenerModuleEvent, data: any) {
        await new Promise(async resolve => {
            const handlerListenersByContext = this.getListenersByContext(context).map(_obs => _obs.handler(data))

            await Promise.all(handlerListenersByContext).then(resolve)
        })
    }

    public async emitToEvent(eventName: ObserverListenerModuleEvent, data: any) {
        await new Promise(async resolve => {
            const handlerListenersByEvent = this.getListenersByEvent(eventName).map(_obs => _obs.handler(data))

            await Promise.all(handlerListenersByEvent).then(resolve)
        })
    }

    public async emitToContextAndEvent(context: string, eventName: ObserverListenerModuleEvent, data: any) {
        await new Promise(async resolve => {
            const handlerListenersByContextAndEvent = this.getListenersByContextAndEvent(context, eventName).map(_obs => _obs.handler(data))

            await Promise.all(handlerListenersByContextAndEvent).then(resolve)
        })
    }

    public async emitToCode(code: number, data: any) {
        await new Promise(async resolve => {
            const listenerByCode = this.getListenerByCode(code)

            await Promise.all([listenerByCode?.handler(data)]).then(resolve)
        })
    }

    public async emitToContextAndCode(context: string, code: number, data: any) {
        await new Promise(async resolve => {
            const listenerByCode = this.getListenerByContextAndCode(context, code)

            await Promise.all([listenerByCode?.handler(data)]).then(resolve)
        })
    }

    public removeListenerByCode(code: number) {
        this.performRemoveListenersByCode([code])
    }

    public removeListenerByContextAndCode(context: string, code: number) {
        const listenerByContextAndEvent = this.getListenerByContextAndCode(context, code)

        if (!listenerByContextAndEvent) {
            return
        }

        this.performRemoveListenersByCode([listenerByContextAndEvent.code])
    }

    public removeListenersByEvent(eventName: ObserverListenerModuleEvent) {
        const listenersByEvent = this.getListenersByEvent(eventName)

        const codeListenersToRemove = listenersByEvent.map(listener => listener.code)

        this.performRemoveListenersByCode(codeListenersToRemove)
    }

    public removeListenersByContextAndEvent(context: string, eventName: ObserverListenerModuleEvent) {
        const listenersByContextAndEvent = this.getListenersByContextAndEvent(context, eventName)

        const codeListenersToRemove = listenersByContextAndEvent.map(listener => listener.code)

        this.performRemoveListenersByCode(codeListenersToRemove)
    }

    public removeListenersByContext(context: string) {
        const listenersByContext = this.getListenersByContext(context)

        const codeListenersToRemove = listenersByContext.map(listener => listener.code)

        this.performRemoveListenersByCode(codeListenersToRemove)
    }

    public removeListenerMainByCode(code: number) {
        this.performRemoveListenersByCode([code])
    }

    public removeListenerMainByContextAndCode(context: string, code: number) {
        const listenerByContextAndEvent = this.getListenerByContextAndCode(context, code)

        if (!listenerByContextAndEvent) {
            return
        }

        this.performRemoveListenersMainByCode([listenerByContextAndEvent.code])
    }

    public removeListenersMainByEvent(eventName: ObserverListenerModuleEvent) {
        const listenersByEvent = this.getListenersByEvent(eventName)

        const codeListenersToRemove = listenersByEvent.map(listener => listener.code)

        this.performRemoveListenersMainByCode(codeListenersToRemove)
    }

    public removeListenersMainByContextAndEvent(context: string, eventName: ObserverListenerModuleEvent) {
        const listenersByContextAndEvent = this.getListenersByContextAndEvent(context, eventName)

        const codeListenersToRemove = listenersByContextAndEvent.map(listener => listener.code)

        this.performRemoveListenersMainByCode(codeListenersToRemove)
    }

    public removeListenersMainByContext(context: string) {
        const listenersByContext = this.getListenersByContext(context)

        const codeListenersToRemove = listenersByContext.map(listener => listener.code)

        this.performRemoveListenersMainByCode(codeListenersToRemove)
    }

    private performRemoveListenersByCode(codeListenersToRemove: number[]) {
        const indexListenersToRemove = codeListenersToRemove.map(codeListener => {
            const indexListenersByCode = this.getIndexListenerByCode(codeListener)

            return indexListenersByCode
        })

        this.performRemoveListenersByIndex(indexListenersToRemove)
    }

    private performRemoveListenersMainByCode(codeListenersToRemove: number[]) {
        const indexListenersToRemove = codeListenersToRemove.map(codeListener => {
            const indexListenersByCode = this.getIndexListenerMainByCode(codeListener)

            return indexListenersByCode
        })

        this.performRemoveListenersByIndex(indexListenersToRemove)
    }

    private performRemoveListenersByIndex(indexListenersToRemove: number[]) {
        indexListenersToRemove.forEach(indexListener => {
            if (indexListener < 0) {
                return
            }

            this.listeners.splice(indexListener, 1)
        })
    }

    // Query
    public getListenersByEvent(eventName: ObserverListenerModuleEvent) {
        const listenersByEvent = this.listeners.filter(_obs => _obs.event == eventName)

        return listenersByEvent
    }

    public getListenersByContextAndEvent(context: string, eventName: ObserverListenerModuleEvent) {
        const listenersByContextAndEvent = this.listeners.filter(_obs => _obs.context == context && _obs.event == eventName)

        return listenersByContextAndEvent
    }

    public getListenersByContext(context: string) {
        const listenersByContext = this.listeners.filter(_obs => _obs.context == context)

        return listenersByContext
    }

    public getListenerByCode(codeEvent: number) {
        const listenerByCode = this.listeners.find(_obs => _obs.code == codeEvent)

        return listenerByCode || null
    }

    public getListenerByContextAndCode(context: string, codeEvent: number) {
        const listenerByContextAndCode = this.listeners.find(_obs => _obs.context == context && _obs.code == codeEvent)

        return listenerByContextAndCode || null
    }

    public getIndexListenerByCode(codeEvent: number) {
        const indexListenerByCode = this.listeners.findIndex(_obs => _obs.code == codeEvent)

        return indexListenerByCode
    }

    public getIndexListenerByContextAndCode(context: string, codeEvent: number) {
        const indexListenerByContextAndCode = this.listeners.findIndex(_obs => _obs.context == context && _obs.code == codeEvent)

        return indexListenerByContextAndCode
    }

    public getListenersMainByEvent(eventName: ObserverListenerModuleEvent) {
        const listenersByEvent = this.listeners.filter(_obs => _obs.event == eventName && _obs.main)

        return listenersByEvent
    }

    public getListenersMainByContextAndEvent(context: string, eventName: ObserverListenerModuleEvent) {
        const listenersByContextAndEvent = this.listeners.filter(_obs => _obs.context == context && _obs.event == eventName && _obs.main)

        return listenersByContextAndEvent
    }

    public getListenersMainByContext(context: string) {
        const listenersByContext = this.listeners.filter(_obs => _obs.context == context && _obs.main)

        return listenersByContext
    }

    public getListenerMainByCode(codeEvent: number) {
        const listenerByCode = this.listeners.find(_obs => _obs.code == codeEvent && _obs.main)

        return listenerByCode || null
    }

    public getListenerMainByContextAndCode(context: string, codeEvent: number) {
        const listenerByContextAndCode = this.listeners.find(_obs => _obs.context == context && _obs.code == codeEvent && _obs.main)

        return listenerByContextAndCode || null
    }

    public getIndexListenerMainByCode(codeEvent: number) {
        const indexListenerByCode = this.listeners.findIndex(_obs => _obs.code == codeEvent && _obs.main)

        return indexListenerByCode
    }

    public getIndexListenerMainByContextAndCode(context: string, codeEvent: number) {
        const indexListenerByContextAndCode = this.listeners.findIndex(_obs => _obs.context == context && _obs.code == codeEvent && _obs.main)

        return indexListenerByContextAndCode
    }

    public get listeners() {
        return this._listeners
    }

    public set listeners(value: ObserverListener[]) {
        this._listeners = value
    }
}
