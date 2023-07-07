import { ObserverEventsModel,  ObserverEvent } from "../lib/observer/observer"

type EventsTest = {
    "start": {hello: string},
    "end": {world: string},
    "in": {helloWorld: string}

}

cconst teste: ObserverEventsModel<EventsTest> = {
    
}
const observer = new ObserverEvent<"Teste", EventsTest>("Teste")