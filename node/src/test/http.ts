import { Server } from '../lib/http/server/observers/server'
import { Client } from '../lib/http/server/observers/client'

type EventsPublic = {
    'GET': {
        'hello': {
            body: { hello: string }
            response: { world: string }
        }
    }
    'POST': {
        'world': {
            body: { world: string }
            response: { hello: string }
        }
    }
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
type EventsPrivate = {
    'POST': {
        'world': {
            body: { world: string }
            response: { hello: string }
        }
    }
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}

async function App() {
    const server = new Server<EventsPublic>({ context: 'PUBLIC' })
    const client = new Client<EventsPublic>({ context: 'PUBLIC', origem: 'Teste' })

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    const response = await client.get('hello', { hello: 'test' })

    console.log(response.getValue())
}

App()
