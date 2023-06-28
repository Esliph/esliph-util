/* eslint no-unused-expressions: ["off"] */

import { EnumColorsBackground, EnumColorsStyles, EnumColorsText } from '@util/color'
import { setUncaughtExceptionCaptureCallback } from 'process'

const consoleNative = console

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

// Enums
const EnumTemplateCharacters = {
    open: '<',
    close: '>',
} as const

const EnumTemplateParams = {
    color: 'color',
    background: 'background',
    styles: 'styles',
} as const

const EnumCliColors = {
    color: Object.keys(EnumColorsText),
    background: Object.keys(EnumColorsBackground),
    styles: Object.keys(EnumColorsStyles),
} as const

const EnumConsoleMethod = {
    info: 'info',
    log: 'log',
    error: 'error',
    warn: 'warn',
} as const

// Template
type GenericType<T extends string, U = any> = { [x in T]: U }

type NativeTypes = Date | number | string | boolean | object | any[] | Function | bigint | null | undefined

type KeysFormTemplate<T extends string> = GenericType<T, NativeTypes | ((args: { method: keyof typeof EnumConsoleMethod; message: any }) => NativeTypes)>

type TemplateKeys<S extends string> = S extends `${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<RestAfter>
    : S extends `${infer RestBefore}${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<`${RestBefore}${RestAfter}`>
    : never

type FilterKeysName<T extends string> = T extends `!${infer Value}` ? never : T

type ExtractKeysName<T extends string> = T extends `${infer Value}?${infer _}` ? Value : T

type ExtractKeys<T extends string> = FilterKeysName<ExtractKeysName<TemplateKeys<T>>>

type KeysInput<T extends string> = Partial<KeysFormTemplate<ExtractKeys<T>>>

const CAPTURE_KEY = /<(?!.*?!.+?>)(.*?)>/g

// Config
type ConsoleConfig<T extends string> = {
    template?: T
}

const DEFAULT_TEMPLATE = '# <pidName?color=blue> <pidCode> <dateTime> <method?background=blue&color=yellowLight> [<context>]: <message>'
const DEFAULT_KEYS_VALUES: KeysInput<''> = {}

function getDefaultConfig<T extends string>(args?: { template?: T }) {
    const config: ConsoleConfig<T> = {
        template: args && args.template ? args.template : (DEFAULT_TEMPLATE as T),
    }

    const keysValues: KeysInput<T> = {}

    return { config, keysValues }
}

export class Console<Template extends string = typeof DEFAULT_TEMPLATE> {
    private config: ConsoleConfig<Template>
    private keysValues: KeysInput<Template>

    constructor(args?: { template?: Template }, keysValues?: KeysInput<Template>) {
        this.config = { ...getDefaultConfig<Template>(args).config, ...args }
        this.keysValues = { ...getDefaultConfig<Template>(args).keysValues, ...keysValues }
    }

    // Util
    private getConfig<T extends string = Template>(options?: ConsoleConfig<T>, keysValues?: KeysInput<T>) {
        const configs = [this.config, options]
        const kv = [this.keysValues, keysValues]

        const config: ConsoleConfig<T> = Object.assign({}, ...configs)
        const keysValue: GenericType<T> = Object.assign({}, ...kv)

        return { config, keysValues: keysValue }
    }
    
    private print<T extends string = Template>(config: ConsoleConfig<T>) {
        if (!config.template) {
            return null
        }

        const values: Partial<GenericType<any>> = {}

        for (const key in _keysValues) {
            switch (typeof _keysValues[key]) {
                case 'function':
                    values[key] = _keysValues[key]({ message, method: 'log' }) || ''
                    break
                default:
                    values[key] = _keysValues[key] || ''
            }
        }

        const kv = values as Partial<KeysFormTemplate<ExtractKeysName<TemplateKeys<Template>>>>

        const templateProcessed = this.processTemplate({ template: config.template, keysValues: kv, message })

        return templateProcessed
    }

    private processTemplate<T extends string = Template>({ message, template, keysValues }: { template: string; message: string; keysValues?: KeysInput<T> }) {
        const keys = this.extractKeys(template)

        for (const key in keysValues) {
            // @ts-expect-error
            const index = keys.findIndex(_k => _k.key == key)

            if (index < 0) {
                continue
            }

            // @ts-expect-error
            keys[index].value = keysValues[key]
        }

        return keys
    }

    private transformKeys(template: string[]) {}

    private extractKeys(template: string) {
        const matches = template.match(CAPTURE_KEY) || []

        const keys = matches.map(match => match.replace(/<|>/g, ''))

        const keysOperators = keys.map(_key => {
            let [key, param] = _key.replace(/ /gi, '').split('?')

            if (!key && !param) {
                return false
            }

            if (key) key = key.trim()
            else key = '?'

            let params: { [x in keyof { color: string; background: string; styles: string[] }]?: string }[] = []

            if (param) {
                params = param
                    .split('&')
                    .filter(_param => {
                        const [key, value] = _param.split('=')

                        return (
                            // @ts-expect-error
                            typeof EnumTemplateParams[key] != 'undefined' &&
                            typeof EnumCliColors[key as 'color'] != 'undefined' &&
                            EnumCliColors[key as 'color'].find(_color => _color == value)
                        )
                    })
                    .map(param => {
                        const [key, value] = param.split('=')

                        return { [`${key}`]: value }
                    })
            }

            return { key, ...(params.length > 0 && { params }), value: '' }
        })

        return keysOperators
    }

    // UC
    log<T extends string = Template>(message?: any, config?: { template?: T } | null, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig(config || {}, keysValues || {})

        this.print(config, keysValues)
    }

    clear() {
        consoleNative.clear()
    }

    native() {
        return consoleNative
    }

    static native() {
        return consoleNative
    }

    static clear() {
        new Console().clear()
    }
}
