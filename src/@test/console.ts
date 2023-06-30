import { Console } from '@lib/console.sketch'

Console.clear()

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour12: false,
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
    calendar: 'gregory',
})

const template = '# [<pidName?color=green>] <pidCode?color=green>  <dateTime> <method?background=blue> <context?color=green>: <message>'

const consoleLiph = new Console({ template }, {
    context: '[Teste]',
    dateTime: () => dateTimeFormatter.format(new Date(Date.now())).replace(', ', ' '),
    pidName: 'Esliph',
    pidCode: () => process.pid,
    method: ({ method }) => ` ${method.toUpperCase()} `,
    message: ({ message }) => message,
})

const value = consoleLiph.log('Hello World', {})

console.log(value)