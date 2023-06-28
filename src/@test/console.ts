import { Console } from '@lib/console.sketch'

Console.clear()

const template = '# <pidName?color=blue> <pidCode?styles=bold> <dateTime> <method?background=blue&color=yellowLight> [<context>]: <message>'

const consoleLiph = new Console({ template })

const value = consoleLiph.log('Hello World', {}, {
    context: () => 'Teste',
})

/* eslint no-unused-expressions: ["off"] */
value && value.map(val => console.log(val))