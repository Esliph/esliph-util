/* eslint no-unused-expressions: ["off"] */

import { EnumColorsBackground, EnumColorsStyles, EnumColorsText } from '@util/color'

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
type KeysFormTemplate<T extends string> = {
    [k in T]: (args: { method: keyof typeof EnumConsoleMethod; message: any }) => any
}

type TemplateKeys<S extends string> = S extends `${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<RestAfter>
    : S extends `${infer RestBefore}${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<`${RestBefore}${RestAfter}`>
    : never

type ExtractKeysName<T extends string> = T extends `${infer Value}?${infer Rest}` ? Value | TemplateKeys<Rest> : T

type KeysInput<T extends string> = Partial<KeysFormTemplate<ExtractKeysName<TemplateKeys<T>>>>

const CAPTURE_KEY = /<(?!.*?!.+?>)(.*?)>/g

// Config
type ConsoleConfig<T extends string> = {
    template?: T
}

const DEFAULT_TEMPLATE = '# <pidName?color=blue> <pidCode> <dateTime> <method?background=blue&color=yellowLight> [<context>]: <message>'

function getDefaultConfig<T extends string>(args?: { template?: T }) {
    const config: ConsoleConfig<T> = {
        template: args && args.template ? args.template : (DEFAULT_TEMPLATE as T),
    }

    return config
}

export class Console<Template extends string = typeof DEFAULT_TEMPLATE> {
    private config: ConsoleConfig<Template>

    constructor(args?: { template?: Template }) {
        this.config = { ...getDefaultConfig<Template>(args), ...args }
    }

    // Util
    private getConfig<T extends string = Template>(options?: ConsoleConfig<T>) {
        const configs = [this.config, options]

        const config: ConsoleConfig<T> = Object.assign({}, ...configs)

        return config
    }

    private processTemplate<T extends string = Template>({ message, template, keysName }: { template: string, message: string, keysName?: KeysInput<T> }) {
        keysName && Object.keys(keysName).forEach((_keyName: string) => {
            // @ts-expect-error
            const val = keysName[_keyName]
            if (typeof val == 'function') { val({ method: 'log', message, }) }
        })

        const keys = this.extractKeys(template)

        return keys
    }

    private transformKeys(template: string[]) { }

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

                        // @ts-expect-error
                        return typeof EnumTemplateParams[key] != 'undefined' && typeof EnumCliColors[key as 'color'] != 'undefined' && EnumCliColors[key as 'color'].find(_color => _color == value)
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

    log<T extends string = Template>(message?: any, config?: { template?: T } | null, keysName?: KeysInput<T>) {

        const { template } = this.getConfig(config || {})

        if (!template) {
            return null
        }

        return this.processTemplate({ template, keysName, message })
    }

    clear() {
        consoleNative.clear()
    }

    static clear() {
        new Console().clear()
    }
}
