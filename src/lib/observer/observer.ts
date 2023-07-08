import { ObserverCore } from './core'

export class ObserverEvent<Context extends string, EventsName extends object = {}> {
    public static observerCore = new ObserverCore()
    private context: string

    constructor(context: Context) {
        this.context = context
    }

    public on<Event extends keyof EventsName>(eventName: Event, handler: (data: EventsName[Event]) => void) {
        return ObserverEvent.observerCore.onWithContext(eventName, handler, this.context)
    }

    public onMain<Event extends keyof EventsName>(eventName: Event, handler: (data: EventsName[Event]) => void) {
        return ObserverEvent.observerCore.onMainWithContext(eventName, handler, this.context)
    }

    public async emitToEvent<Event extends keyof EventsName>(eventName: Event, data: EventsName[Event]) {
        await ObserverEvent.observerCore.emitToContextAndEvent(this.context, eventName, data)
    }

    public async emitToCode<Event extends keyof EventsName>(code: number, data: EventsName[Event]) {
        await ObserverEvent.observerCore.emitToContextAndCode(this.context, code, data)
    }

    public removeListenerByCode(code: number) {
        ObserverEvent.observerCore.removeListenerByContextAndCode(this.context, code)
    }

    public removeListenersByEvent<Event extends keyof EventsName>(eventName: Event) {
        ObserverEvent.observerCore.removeListenersByContextAndEvent(this.context, eventName)
    }

    public removeListenerMainByCode(code: number) {
        ObserverEvent.observerCore.removeListenerMainByContextAndCode(this.context, code)
    }

    public removeListenersMainByEvent<Event extends keyof EventsName>(eventName: Event) {
        ObserverEvent.observerCore.removeListenersMainByContextAndEvent(this.context, eventName)
    }

    // Query
    public getListenersByEvent<Event extends keyof EventsName>(eventName: Event) {
        return ObserverEvent.observerCore.getListenersByContextAndEvent(this.context, eventName)
    }

    public getListeners() {
        return ObserverEvent.observerCore.getListenersByContext(this.context)
    }

    public getListenerByCode(codeEvent: number) {
        return ObserverEvent.observerCore.getListenerByContextAndCode(this.context, codeEvent)
    }

    public getIndexListenerByCode(codeEvent: number) {
        return ObserverEvent.observerCore.getIndexListenerByContextAndCode(this.context, codeEvent)
    }

    public getListenersMainByEvent<Event extends keyof EventsName>(eventName: Event) {
        return ObserverEvent.observerCore.getListenersMainByContextAndEvent(this.context, eventName)
    }

    public getListenerMainByCode(codeEvent: number) {
        return ObserverEvent.observerCore.getListenerMainByContextAndCode(this.context, codeEvent)
    }

    public getIndexListenerMainByCode(codeEvent: number) {
        return ObserverEvent.observerCore.getIndexListenerMainByCode(codeEvent)
    }

    get observerCore() {
        return ObserverEvent.observerCore
    }

    public getContext() {
        return this.context
    }

    public setContext(value: string) {
        this.context = value
    }
}
