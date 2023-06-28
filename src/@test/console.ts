import { Console } from '@lib/console.sketch'

Console.clear()

const template = '# <pidName?color=blue> <pidCode> <dateTime> <method?color=yellow>> [<context>]: <message>'

const consoleLiph = new Console({
    template
})

const value = consoleLiph.log('Hello World', {}, {})

/* eslint no-unused-expressions: ["off"] */
value && value.map(val => console.log(val))