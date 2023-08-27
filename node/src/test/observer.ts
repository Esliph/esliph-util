import { ObserverEvent } from './../lib/observer/observer-event'

type EventsExemplo = {
    'message': { message: string }
    'response': { response: string }
}

const observerEvent = new ObserverEvent<EventsExemplo>()

observerEvent.on('message', ({ message }) => {
    console.log({ message }, 2)
})

observerEvent.on('message', ({ message }) => {
    console.log({ message }, 1)
}, 1)

observerEvent.on('response', ({ response }) => {
    console.log({ response })
})

observerEvent.emit('message', { message: 'hello world' })
observerEvent.emit('response', { response: 'hello world' })