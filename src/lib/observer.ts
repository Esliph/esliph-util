import { ObserverEventModel, ObserverEventData } from '@esliph/util'
import { randomId } from '@lib/generate-id'

export function ObserverEvent<Events>(): ObserverEventModel<Events> {
    const listeners: ObserverEventModel<Events>['listeners'] = []

    const on: ObserverEventModel<Events>['on'] = <E extends Events>(evt: E, handler: (data: ObserverEventData) => void, main?: boolean) => {
        const code = randomId.int()

        listeners.push({ evt, handler, code, main })

        return code
    }

    const emit: ObserverEventModel<Events>['emit'] = async <U extends Events>(evt: U, data: ObserverEventData) => {
        await new Promise(resolve => {
            const promises = listeners.filter(_obs => _obs.evt == evt).map((_obs) => _obs.handler(data))

            Promise.all(promises).then(resolve)
        })
    }

    const removeListener: ObserverEventModel<Events>['removeListener'] = code => {
        const index = listeners.findIndex(obs => obs.code == code)

        if (index < 0) { return }

        listeners.splice(index, 1)
    }

    const clearListeners: ObserverEventModel<Events>['clearListeners'] = main => {
        /* eslint no-unused-expressions: ["off"] */
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].main) {
                main && listeners.splice(i, 1)

                continue
            }
            !main && listeners.splice(i, 1)
        }
    }

    return {
        on,
        emit,
        removeListener,
        listeners,
        clearListeners,
    }
}
