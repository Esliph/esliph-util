import { Server } from '../lib/http/server/observers/server'
import { Client } from '../lib/http/server/observers/client'

type Events = {
    'PUBLIC': {
        'hello': {
            body: { hello: string }
            response: { world: string }
        }
    }
    'PRIVATE': {
        'world': {
            body: { world: string }
            response: { hello: string }
        }
    }
}

async function App() {
    const server = new Server<Events, 'PUBLIC'>({ context: 'PUBLIC' })
    const client = new Client<Events, 'PUBLIC'>({ context: 'PUBLIC' })

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    const response = await client.get('hello', { hello: 'world' })

    console.log(response)
}

async function App2() {
    const server = new Server<Events, 'PRIVATE'>({ context: 'PRIVATE' })
    const client = new Client<Events, 'PRIVATE'>({ context: 'PRIVATE' })

    server.get('world', ({ body }, res) => {
        res.send({ hello: body.world })
    })

    const response = await client.get('world', { world: 'hello' })

    console.log(response)
}

App()
App2()
