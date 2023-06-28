import { Console } from '@lib/console'

Console.clear()

const consoleLiph = new Console({
    pidName: 'Esliph',
    context: 'Test',
})

consoleLiph.log('Hello World')
consoleLiph.error('Hello World')
consoleLiph.warn('Hello World')
consoleLiph.info('Hello World')