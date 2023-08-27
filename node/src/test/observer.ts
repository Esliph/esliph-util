import { ObserverEvent } from './../lib/observer/observer-event'

type EventsExemplo = {
    'message': { message: string }
    'response': { response: string }
}

const observerEvent = new ObserverEvent<EventsExemplo>()

observerEvent.on('message', ({ message }) => {
    console.log({ message }, 3)
})

observerEvent.on('message', ({ message }) => {
    console.log({ message }, 1)
}, 1)

observerEvent.on('message', ({ message }) => {
    console.log({ message }, 2)
}, 3)

observerEvent.emit('message', { message: 'hello world' })