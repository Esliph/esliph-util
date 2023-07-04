import { Console } from '../lib/console'

Console.clear()

const consoleLiph = new Console({ methodsValue: { context: '[Teste]' } })

Console.observer.on('log', () => console.log('Log!!'))
consoleLiph.on('log', () => {console.log('log')})
consoleLiph.on('error', () => {console.log('error')})
consoleLiph.on('warn', () => {console.log('warn')})
consoleLiph.on('info', () => {console.log('info')})

consoleLiph.log('Hello World')
consoleLiph.error('Hello World')
consoleLiph.warn('Hello World')
consoleLiph.info('Hello World')