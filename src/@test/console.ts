import { Console } from '../lib/console'

Console.clear()

const consoleEsliph = new Console({ methodsValue: { context: '[Teste]' } })

Console.observer.on('log', () => console.log('Log!!'))
consoleEsliph.on('log', () => {console.log('log')})
consoleEsliph.on('error', () => {console.log('error')})
consoleEsliph.on('warn', () => {console.log('warn')})
consoleEsliph.on('info', () => {console.log('info')})

consoleEsliph.log('Hello World')
consoleEsliph.error('Hello World')
consoleEsliph.warn('Hello World')
consoleEsliph.info('Hello World')