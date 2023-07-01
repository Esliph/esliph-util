import { Console } from '@lib/console-methods.sketch'

Console.clear()

const consoleLiph = new Console({}, { context: '[Teste]' })

consoleLiph.log('Hello World')
consoleLiph.error('Hello World')
consoleLiph.warn('Hello World')
consoleLiph.info('Hello World')