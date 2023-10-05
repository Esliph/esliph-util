import { Server } from '../lib/http/server/observers/server'
import { Client } from '../lib/http/server/observers/client'

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

async function App() {
    const server = new Server<Events, 'PUBLIC'>('PUBLIC')
    const client = new Client<Events, 'PUBLIC'>('PUBLIC')

    server.on('router/start', (args) => {
        console.log({ start: args })
    })
    server.on('router/end', (args) => {
        console.log({ end: args })
    })
    server.on('success', (args) => {
        console.log({ success: args })
    })
    server.on('error', (args) => {
        console.log({ error: args })
    })

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    const response = await client.get('hello', { hello: 'world' })
}

App()
