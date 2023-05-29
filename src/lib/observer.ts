import { TObserver } from '@esliph/util'
import { randomId } from '@lib/generate-id'

export function ObserverEvent() {
    const observers: TObserver[] = []

    const on = (evt: string, handler: <T>(data: T) => void) => {
        const code = randomId.int()
        observers.push({ evt, handler, code })

        return code
    }

    const emit = <T>(evt: string, data: T) => {
        observers.filter(_obs => { return _obs.evt == evt }).forEach(_obs => {
            setTimeout(() => {
                _obs.handler({ data })
            }, 1)
        })
    }

    const removeListener = (code: number) => {
        const index = observers.findIndex(obs => obs.code == code)

        if (index < 0) { return }

        observers.splice(index, 1)
    }

    return {
        on,
        emit,
        removeListener
    }
}