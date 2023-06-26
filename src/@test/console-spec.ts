import { Console } from '@lib/console'

const console = new Console({
    context: 'Teste',
    pidName: 'Esliph',
    normal: true
})

console.clear()

console.info('Hello World', {messageSameLine: true})
console.log('Hello World', {messageSameLine: true})
console.warn('Hello World', {messageSameLine: true})
console.error('Hello World')