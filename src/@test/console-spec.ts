import { Console } from '@lib/console'

const console = new Console({
    context: 'Teste',
    config: { pidName: 'Esliph' },
})

console.clear()
console.info('Hello World')
console.log('Hello World')
console.warn('Hello World')
console.error('Hello World')