import { ObserverEvent } from './../lib/observer/observer-event'

type EventsExemplo = {
    'message': { message: string }
    'response': { response: string }
}

const observerEvent = new ObserverEvent<EventsExemplo>()

const evt1 = observerEvent.on('message', ({ message }) => {
    console.log({ message })
})

observerEvent.on('message', ({ message }) => {
    console.log({ message })
})

observerEvent.on('response', ({ response }) => {
    console.log({ response })
})

observerEvent.removeEvent(evt1)

observerEvent.emit('message', { message: 'hello world' })
observerEvent.emit('response', { response: 'hello world' })