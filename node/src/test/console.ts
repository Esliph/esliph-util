import { Console } from './../lib/console/console'

const console = new Console({
    methodsValue: {
        context: 'Teste'
    }
})

console.log('Hello World')