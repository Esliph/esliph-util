import { ObserverEvent } from '../lib/observer/index'

type EventsTest = {
    'start': { hello: string }
    'end': { world: string; teste: string }
    'in': { helloWorld: string }
}

const observer = new ObserverEvent<'Teste', EventsTest>('Teste')

const codeListener1 = observer.on('start', data => console.log(data))
const codeListener2 = observer.on('end', data => console.log(data))

observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })
observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })
observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })

observer.emitToEvent('start', { hello: 'World' })

observer.removeListenerByCode(codeListener2)

observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })
observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })
observer.emitToEvent('end', { world: 'Hello', teste: 'Teste' })

observer.emitToEvent('start', { hello: 'World' })
observer.emitToEvent('start', { hello: 'World' })

observer.removeListenerByCode(codeListener1)

observer.emitToEvent('start', { hello: 'World' })
observer.emitToEvent('start', { hello: 'World' })
observer.emitToEvent('start', { hello: 'World' })

observer.on('start', data => console.log(data))

observer.ObserverCore.emitToEvent('start', { hello: 'World!' })

new ObserverEvent('Teste2').ObserverCore.emitToContextAndEvent('Teste2', 'start', { hello: 'World!!' })

console.log(observer.ObserverCore.listeners)
