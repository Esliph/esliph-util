import { ObserverEventModel, ObserverEventData } from '@esliph/util'
import { randomId } from '@lib/generate-id'

export function ObserverEvent<Events>(): ObserverEventModel<Events> {
    const listeners: ObserverEventModel<Events>['listeners'] = []

    const on: ObserverEventModel<Events>['on'] = <E extends Events>(evt: E, handler: (data: ObserverEventData) => void, main?: boolean) => {
        const code = randomId.int()

        listeners.push({ evt, handler, code, main })

        return code
    }

    const emit: ObserverEventModel<Events>['emit'] = <U extends Events>(evt: U, data: ObserverEventData) => {
        setTimeout(() => {
            listeners
                .filter(_obs => {
                    return _obs.evt == evt
                })
                .forEach(_obs => {
                    setTimeout(() => _obs.handler(data), 1)
                })
        }, 1)
    }

    const removeListener: ObserverEventModel<Events>['removeListener'] = code => {
        const index = listeners.findIndex(obs => obs.code == code)

        if (index < 0) {
            return
        }

        listeners.splice(index, 1)
    }

    const clearListeners: ObserverEventModel<Events>['clearListeners'] = main => {
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].main) {
                if (main) {
                    listeners.splice(i, 1)
                }

                continue
            }
            if (!main) {
                listeners.splice(i, 1)
            }
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
