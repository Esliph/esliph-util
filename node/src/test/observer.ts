import { ObserverListener, ObserverEmitter } from '../lib/observer'

type Events = {
    'hello': { delay: number, awaiter?: boolean }
}

function delay(ms = 1) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function App() {
    const observerListener = new ObserverListener<Events>()
    const observerEmitter = new ObserverEmitter<Events>()

    observerListener.on('hello', async ({ delay: d, awaiter }) => {
        if (awaiter) {
            await delay(d)
        } else {
            delay(d)
        }
        console.log('Exec')
    })

    console.log('!')
    await observerEmitter.emit('hello', { delay: 1000 })
    await observerEmitter.emit('hello', { delay: 1000, awaiter: true })
    await observerEmitter.emit('hello', { delay: 1000 })
    console.log('!!')
}

App()
