import { randomId } from '@lib/generate-id'
import { TObserver } from '@@types/observer'

export function ObserverEvent() {
    const observers: TObserver[] = []

    const registerEvent = (observer: { handler: <T>(data: T) => void, type: string }) => {
        const code = randomId.int()
        observers.push({ ...observer, code })

        return code
    }

    const dispareEvent = <T>({ type, data }: { data: T, type: string }) => {
        observers.filter(_obs => { return _obs.type == type }).forEach(_obs => {
            setTimeout(() => {
                _obs.handler({ data })
            }, 1)
        })
    }

    return {
        registerEvent,
        dispareEvent,
    }
}
