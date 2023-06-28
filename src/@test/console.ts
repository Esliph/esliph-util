import { Console } from '@lib/console.sketch'

Console.clear()

Console.native().log('\n')

const template = '# <pidName?color=blue> <pidCode?styles=bold> <dateTime> <method?background=blue&color=yellowLight> [<context>]: <message>'

const consoleLiph = new Console({ template }, {
    context: () => 'Teste',
    dateTime: (args) => new Date(Date.now()),
    pidName: 'Esliph',
    pidCode: () => process.pid,
    method: ({method}) => method,
    message: ({message}) => message,
})

const value = consoleLiph.log({hello: 'World'}, {})

/* eslint no-unused-expressions: ["off"] */
console.log(JSON.stringify({template: value}, null, 2))