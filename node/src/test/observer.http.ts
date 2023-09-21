import { ObserverServer, ObserverClient } from './../lib/observer/http/'

const observerServer = new ObserverServer()
const observerClient = new ObserverClient()

observerServer.post('users', ({ body }) => {
    return { data: 'Hello' }
})

async function App() {
    const response = await observerClient.post('users', { body: '' })

    console.log(response)
}

App()
