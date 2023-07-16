import { randomIdIntWithDate } from '../random'

export type ObserverListenerModuleEvent = any

export type ObserverListenerImp = {
    handler: (data: any) => void
    event: ObserverListenerModuleEvent
    code: number
    context: string
    main: boolean
}

export class ObserverListener implements ObserverListenerImp {
    public readonly handler: (data: any) => void
    public event: ObserverListenerModuleEvent
    public code: number
    public context: string
    public main: boolean

    private constructor(event: ObserverListenerModuleEvent, handler: (data: any) => void, code: number, context = '', main = false) {
        this.handler = handler
        this.event = event
        this.code = code
        this.context = context
        this.main = main
    }

    public static onWithoutContext(event: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const codeListenerWithoutContext = randomIdIntWithDate()

        const listenerWithoutContext = new ObserverListener(event, handler, codeListenerWithoutContext, '', false)

        return listenerWithoutContext
    }

    public static onWithContext(event: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const codeListenerWithContext = randomIdIntWithDate()

        const listenerWithContext = new ObserverListener(event, handler, codeListenerWithContext, context, false)

        return listenerWithContext
    }

    public static onMainWithoutContext(event: ObserverListenerModuleEvent, handler: (data: any) => void) {
        const codeListenerWithoutContext = randomIdIntWithDate()

        const listenerWithoutContext = new ObserverListener(event, handler, codeListenerWithoutContext, '', true)

        return listenerWithoutContext
    }

    public static onMainWithContext(event: ObserverListenerModuleEvent, handler: (data: any) => void, context: string) {
        const codeListenerWithContext = randomIdIntWithDate()

        const listenerWithContext = new ObserverListener(event, handler, codeListenerWithContext, context, true)

        return listenerWithContext
    }
}
