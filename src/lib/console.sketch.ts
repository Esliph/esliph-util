const consoleNative = console

// Date
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

// Enuns
const EnumTemplateCharacters = {
    open: '<',
    close: '>',
} as const

const EnumTemplateParams = {
    color: 'color',
    background: 'background',
    styles: 'styles',
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

function getDefaultConfig<T extends string>(args?: { template?: T }) {
    const config: ConsoleConfig<T> = {
        template: args ? args.template : ('' as T),
    }

    return config
}

export class Console<Template extends string> {
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

    private processTemplate(template: string) {
        const keys = this.extractKeys(template)

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
                    // @ts-expect-error
                    .filter(_param => typeof EnumTemplateParams[_param.split('=')[0]] != 'undefined')
                    .map(param => {
                        const [key, value] = param.split('=')

                        return { [`${key}`]: value }
                    })
            }

            return { key, ...(params.length > 0 && { params }) }
        })

        return keysOperators
    }

    log<T extends string = Template>(message?: any, config?: { template?: T }, keysName?: KeysInput<T>) {
        /* eslint no-unused-expressions: ["off"] */
        keysName &&
            Object.keys(keysName as object).forEach(_keyName => {
                // @ts-expect-error
                const val = keysName[_keyName]
                if (typeof val == 'function') {
                    val({
                        method: 'log',
                        message,
                    })
                }
            })

        const { template } = this.getConfig(config)

        if (!template) {
            return null
        }

        return this.processTemplate(template)
    }

    clear() {
        consoleNative.clear()
    }

    static clear() {
        new Console().clear()
    }
}
