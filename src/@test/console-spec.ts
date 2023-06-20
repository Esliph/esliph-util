import { Console } from '@lib/console'
import { ColorsTextEnable, colorizeText } from '@util/color'

const console = new Console({
    context: 'Teste',
    config: { pidName: 'Esliph' },
})

Console.clear()
console.log('Hello World')
console.warn('Hello World')
console.error('Hello World')