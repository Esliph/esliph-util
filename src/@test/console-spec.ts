import { Console } from '@lib/console'

Console.clear()

const consoleLiph = new Console({
    context: 'Teste',
    pidName: 'Esliph'
})

consoleLiph.log("Hello World", {messageSameLine: false})
consoleLiph.error({hello: 'Hello World'})
consoleLiph.warn({hello: 'Hello World'})
consoleLiph.info({hello: 'Hello World'})