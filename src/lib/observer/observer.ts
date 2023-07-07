import { ObserverCore as ObsCore } from './core'

export class ObserverEvent<Context extends string, EventsName extends object = {}> {
    public static ObserverCore = new ObsCore()
    private context: string

    constructor(context: Context) {
        this.context = context
    }

    public on<Event extends keyof EventsName>(eventName: Event, handler: (data: EventsName[Event]) => void) {
        return ObserverEvent.ObserverCore.onWithContext(eventName, handler, this.context)
    }

    public onMaint<Event extends keyof EventsName>(eventName: Event, handler: (data: EventsName[Event]) => void) {
        return ObserverEvent.ObserverCore.onMainWithContext(eventName, handler, this.context)
    }

    public async emitToEvent<Event extends keyof EventsName>(eventName: Event, data: EventsName[Event]) {
        await ObserverEvent.ObserverCore.emitToContextAndEvent(this.context, eventName, data)
    }

    public async emitToCode<Event extends keyof EventsName>(code: number, data: EventsName[Event]) {
        await ObserverEvent.ObserverCore.emitToContextAndCode(this.context, code, data)
    }

    public removeListenerByCode(code: number) {
        ObserverEvent.ObserverCore.removeListenerByContextAndCode(this.context, code)
    }

    public removeListenersByEvent<Event extends keyof EventsName>(eventName: Event) {
        ObserverEvent.ObserverCore.removeListenersByContextAndEvent(this.context, eventName)
    }

    public removeListenerMainByCode(code: number) {
        ObserverEvent.ObserverCore.removeListenerMainByContextAndCode(this.context, code)
    }

    public removeListenersMainByEvent<Event extends keyof EventsName>(eventName: Event) {
        ObserverEvent.ObserverCore.removeListenersMainByContextAndEvent(this.context, eventName)
    }

    // Query
    public getListenersByEvent<Event extends keyof EventsName>(eventName: Event) {
        return ObserverEvent.ObserverCore.getListenersByContextAndEvent(this.context, eventName)
    }

    public getListeners() {
        return ObserverEvent.ObserverCore.getListenersByContext(this.context)
    }

    public getListenerByCode(codeEvent: number) {
        return ObserverEvent.ObserverCore.getListenerByContextAndCode(this.context, codeEvent)
    }

    public getIndexListenerByCode(codeEvent: number) {
        return ObserverEvent.ObserverCore.getIndexListenerByContextAndCode(this.context, codeEvent)
    }

    public getListenersMainByEvent<Event extends keyof EventsName>(eventName: Event) {
        return ObserverEvent.ObserverCore.getListenersMainByContextAndEvent(this.context, eventName)
    }

    public getListenerMainByCode(codeEvent: number) {
        return ObserverEvent.ObserverCore.getListenerMainByContextAndCode(this.context, codeEvent)
    }

    public getIndexListenerMainByCode(codeEvent: number) {
        return ObserverEvent.ObserverCore.getIndexListenerMainByCode(codeEvent)
    }

    get ObserverCore() {
        return ObserverEvent.ObserverCore
    }

    public getContext() {
        return this.context
    }

    public setContext(value: string) {
        this.context = value
    }
}
