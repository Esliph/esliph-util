import { Server } from '../lib/http/server/observers/server'
import { Client } from '../lib/http/server/observers/client'
import { EventsRouter } from '../lib/http/server/events'

type Events = {
    'PUBLIC': {
        'GET': {
            'hello': {
                body: { hello: string }
                response: { world: string }
            }
        }
    }
    'PRIVATE': {
        'POST': {
            'world': {
                body: { world: string }
                response: { hello: string }
            }
        }
    }
}

Client.on<EventsRouter, 'router/end'>('router/end', args => {
    console.log(args)
})

async function App() {
    const server = new Server<Events, 'PUBLIC'>('PUBLIC')
    const client = new Client<Events, 'PUBLIC'>('PUBLIC')

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    await client.get('hello', { hello: 'world' })
    await client.get('hello', { hello: 'world' })
    await client.get('hello', { hello: 'world' })
    await client.get('hello', { hello: 'world' })
}

App()
