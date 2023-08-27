import { ObserverEvent } from './../lib/observer/observer-event'

type EventsExemplo = {
    'message': { message: string }
}

const observerEvent = new ObserverEvent<EventsExemplo>()

observerEvent.on('message', ({ message }) => {
    console.log(message)
})