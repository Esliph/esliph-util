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

Server.on('request/end', arg => {
    console.log(arg)
})

async function App() {
    const server = new Server<EventsPublic>({})
    const client = new Client<EventsPublic>({})

    server.get('hello', ({ body }, res) => {
        res.send({ world: body.hello })
    })

    const response = await client.get('hello', { hello: 'test' })
}

App()
