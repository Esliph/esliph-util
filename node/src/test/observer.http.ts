import { ObserverServer, ObserverClient } from './../lib/observer/http/'

const observerServer = new ObserverServer({})
const observerClient = new ObserverClient()

observerServer.get('users', ({ body }) => {
    return { data: 'Hello' }
})

async function App() {
    const response = await observerClient.get('users', { body: '' }).then(res => res).catch(err => err)

    console.log(response)
}

App()
