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

const template = '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=blue&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?value="[Teste]"&color=greenLight>: <message>'

const consoleLiph = new Console({ template }, {
    dateTime: () => dateTimeFormatter.format(new Date(Date.now())).replace(', ', ' '),
    method: ({ method }) => ` ${method.toUpperCase()} `,
    message: ({ message }) => message,
    pidCode: process.pid,
})

const value = consoleLiph.log('Hello World', {})

Console.native.log(value)