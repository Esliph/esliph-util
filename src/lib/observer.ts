import { randomId } from '@lib/generate-id'

export type ObserverListener<Events> = {
    handler: (data: any) => void
    evt: Events
    code: number
    main?: boolean
}

export class ObserverEvent<Events extends string = ''> {
    listeners: ObserverListener<Events>[]

    constructor() {
        this.listeners = []
    }

    on = <E extends Events>(evt: E, handler: (data: any) => void, main?: boolean) => {
        const code = randomId.int()

        this.listeners.push({ evt, handler, code, main })

        return code
    }

    emit = async <U extends Events>(evt: U, data: any) => {
        /* eslint no-async-promise-executor: ["off"] */

        await new Promise(async resolve => {
            const promises = this.listeners.filter(_obs => _obs.evt == evt).map(_obs => _obs.handler(data))

            await Promise.all(promises).then(resolve)
        })
    }

    removeListener = (code: number) => {
        const index = this.listeners.findIndex(obs => obs.code == code)

        if (index < 0) {
            return
        }

        this.listeners.splice(index, 1)
    }

    clearListeners = (main?: boolean) => {
        /* eslint no-unused-expressions: ["off"] */
        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i].main) {
                main && this.listeners.splice(i, 1)

                continue
            }
            !main && this.listeners.splice(i, 1)
        }
    }
}
