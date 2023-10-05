import { Server } from '../lib/http/server/observers/server'
import { Client } from '../lib/http/server/observers/client'
import { Result } from '../lib/result'

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

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    const response = await client.get('hello', { hello: 'world' })

    console.log(response)
}

async function App2() {
    const server = new Server<Events, 'PRIVATE'>('PRIVATE')
    const client = new Client<Events, 'PRIVATE'>('PRIVATE')

    server.post('world', ({ body }, res) => {})

    const response = await client.post('world', { world: 'hello' })

    console.log(response)
}

App()
App2()
