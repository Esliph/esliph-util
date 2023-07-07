import { LocalStorage } from '../lib'

const local = new LocalStorage()

local.createItem('test', { hello: 'world' })

console.log(LocalStorage.storageMemory.getItem('test'))

local.updateItem('test', { hello: 'world', world: 'hello' })

console.log(local.getItem('test'))
