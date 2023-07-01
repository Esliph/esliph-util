import { ColorizeArgs, ColorsConsoleType, EnumColorsBackground, EnumColorsStyles, EnumColorsText, colorizeText } from '@util/color'

/* eslint no-unused-expressions: ["off"] */

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
    ignore: '!',
    separatorStyles: ';',
    param: '?',
    separatorParam: '&',
    receive: '=',
} as const

const EnumTemplateParams = {
    color: 'color',
    background: 'background',
    styles: 'styles',
    value: 'value',
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

type TEnumConsoleMethod = keyof typeof EnumConsoleMethod

// Template
type GenericType<T extends string, U = any> = { [x in T]: U }

type NativeTypes = Date | number | string | boolean | object | any[] | Function | bigint | null | undefined

type KeysFormTemplate<T extends string> = GenericType<T, NativeTypes | ((args: { method: TEnumConsoleMethod; message: any }) => NativeTypes)>

type TemplateKeys<S extends string> =
    S extends `${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<RestAfter>
    : S extends `${infer RestBefore}${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<`${RestBefore}${RestAfter}`>
    : never

type FilterKeysName<T extends string> = T extends `${typeof EnumTemplateCharacters.ignore}${infer _}` ? never : T

type ExtractKeysName<T extends string> = T extends `${infer Value}${typeof EnumTemplateCharacters.param}${infer _}` ? Value : T

type ExtractKeys<T extends string> = FilterKeysName<ExtractKeysName<TemplateKeys<T>>>

type KeysInput<T extends string> = Partial<KeysFormTemplate<ExtractKeys<T>>>

const CAPTURE_KEY = new RegExp(`${EnumTemplateCharacters.open}(?!/?![a-zA-Z0-9])([^${EnumTemplateCharacters.close}]+)${EnumTemplateCharacters.close}`, 'g')

type ConsoleConfigTemplates<Methods extends TEnumConsoleMethod = TEnumConsoleMethod, Template extends { [k in Methods]?: string } = Record<Methods, string>> = { [x in Methods]?: Template[x] }

const a: ConsoleConfigTemplates = {
    error: '',
    info: '',
    log: '',
    warn: ''
}

// Config
type ConsoleConfig<T extends string, Templates extends string = any> = {
    template?: T
    templates?: Partial<Record<Templates, string>>
}

const getRegexForCapture = (target: string) => {
    return new RegExp(`${EnumTemplateCharacters.open}(?${EnumTemplateCharacters.ignore}\\${EnumTemplateCharacters.ignore})[^${EnumTemplateCharacters.close}]*${target}[^${EnumTemplateCharacters.close}]*${EnumTemplateCharacters.close}`, 'g')
}

const DEFAULT_TEMPLATE = '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>'

const DEFAULT_TEMPLATES: ConsoleConfigTemplates = {
    log: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>',
    error: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=red>  <context?color=green&styles=bold>: <message>',
    warn: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=yellow&color=black>  <context?color=green&styles=bold>: <message>',
    info: '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=white>  <context?color=green&styles=bold>: <message>',
}

type IDefaultTemplate = typeof DEFAULT_TEMPLATE
type IDefaultTemplates = typeof DEFAULT_TEMPLATES

const DEFAULT_TEMPLATE_KEYS_NAME: KeysInput<IDefaultTemplate> = {
    dateTime: () => dateTimeFormatter.format(new Date(Date.now())).replace(', ', ' '),
    method: ({ method }) => ` ${method.toUpperCase()} `,
    message: ({ message }) => message,
    pidCode: process.pid,
}

function getDefaultConfig<T extends string>(args: { template?: T } = {}, keysValues: KeysInput<T> = {}) {
    const config: ConsoleConfig<T> = {
        template: args && args.template ? args.template : (DEFAULT_TEMPLATE as T),
    }

    const kv: KeysInput<T> = { ...DEFAULT_TEMPLATE_KEYS_NAME, ...keysValues } as KeysInput<T>

    return { config, keysValues: kv }
}

export class Console<Template extends string = IDefaultTemplate> {
    private config: ConsoleConfig<Template>
    private keysValues: KeysInput<Template>
    protected native: globalThis.Console = console
    static readonly native: globalThis.Console = console

    constructor(args: { template?: Template } | null = {}, keysValues: KeysInput<Template> = {}) {
        this.config = { ...getDefaultConfig<Template>(args || {}, keysValues).config, ...args }
        this.keysValues = { ...getDefaultConfig<Template>(args || {}, keysValues).keysValues, ...keysValues }
    }

    // Util
    private getConfig<T extends string = Template>(options: ConsoleConfig<T> = {}, keysValues: KeysInput<T> = {}) {
        const configs = [this.config, options]
        const kv = [this.keysValues, keysValues]

        const config: ConsoleConfig<T> = Object.assign({}, ...configs)
        const keysValue: GenericType<T> = Object.assign({}, ...kv)

        return { config, keysValues: keysValue }
    }

    private getOccurrenceForCapture(text: string, selector: string) {
        const selectorRegex = getRegexForCapture(selector)
        let match = selectorRegex.exec(text)

        return match ? { value: match[0], initial: match.index, final: selectorRegex.lastIndex } : null
    }

    // Process
    private print<T extends string>(message: any, method: string, config: ConsoleConfig<T>, keysValues: GenericType<T, any>) {
        if (!config.template) { return null }

        const values: Partial<GenericType<any>> = {}

        for (const key in keysValues) {
            switch (typeof keysValues[key]) {
                case 'function':
                    values[key] = keysValues[key]({ message, method }) || ''
                    break
                default:
                    values[key] = keysValues[key] || ''
            }

            if (typeof values[key] == 'object' || Array.isArray(values[key])) {
                values[key] = '\n' + JSON.stringify(values[key], null, 2) + '\n'
            }
        }

        const kv = values as Partial<KeysFormTemplate<ExtractKeysName<T>>>

        const templateProcessed = this.processTemplate({ template: config.template, keysValues: kv })

        this.native.log(templateProcessed)

        return templateProcessed
    }

    private processTemplate<T extends string>({ template, keysValues }: { template: string; keysValues: KeysInput<T> }) {
        const keys = this.extractKeys(template)

        keys.filter(_k => Object.keys(keysValues).every(_kv => _k.key != _kv)).forEach(_key => {
            const valueParam = _key.params ? _key.params.find(p => p.value)?.value || '' : ''

            const value = valueParam.replace(/['"]/g, '')

            // @ts-expect-error
            keysValues[_key.key] = value
        })

        for (const key in keysValues) {
            const index = keys.findIndex(_key => _key.key == key)
            const params: ColorizeArgs = {}

            if (index < 0) { continue }

            keys[index].params &&
                keys[index].params?.forEach(param => {
                    for (const prop in param) {
                        // @ts-expect-error
                        params[prop as keyof ColorizeArgs] = param[prop]
                    }
                })

            // @ts-expect-error
            keys[index].value = this.colorizeText(keysValues[key], { background: params.background, color: params.color, styles: params.styles })
        }

        keys.forEach(({ value, key }) => {
            const occurrence = this.getOccurrenceForCapture(template, key)

            if (!occurrence) { return }

            template = template.substring(0, occurrence.initial) + value + template.substring(occurrence.final)
        })

        return template
    }

    private extractKeys(template: string) {
        const keysName: string[] = template.match(CAPTURE_KEY)?.map(m => m.replace(/<|>/g, '')) || []

        const keysOperators = keysName
            .filter(_key => {
                let [key, param] = _key.replace(/ (?=(?:(?:[^'"]*['"]){2})*[^'"]*$)/g, '').split(EnumTemplateCharacters.param)

                return key || param
            })
            .map(_key => {
                let [key, param] = _key.replace(/ (?=(?:(?:[^'"]*['"]){2})*[^'"]*$)/g, '').split(EnumTemplateCharacters.param)

                if (!key) key = EnumTemplateCharacters.param

                let params: { [x in keyof { color: string; background: string; styles: string[]; value: string }]?: string }[] = []

                if (param) {
                    params = param
                        .split(EnumTemplateCharacters.separatorParam)
                        .filter(_param => {
                            const [key, value] = _param.split(EnumTemplateCharacters.receive)

                            const styles = value.split(EnumTemplateCharacters.separatorStyles)

                            return (
                                // @ts-expect-error
                                (typeof EnumTemplateParams[key] != 'undefined' &&
                                    typeof EnumCliColors[key as 'color'] != 'undefined' &&
                                    styles.filter(_style => EnumCliColors[key as 'color'].find(_prop => _prop == _style))) ||
                                key == EnumTemplateParams.value
                            )
                        })
                        .map(param => {
                            const [key, value] = param.split(EnumTemplateCharacters.receive)

                            return { [`${key}`]: key != 'styles' ? value : value.split(EnumTemplateCharacters.separatorStyles).filter(param => param) }
                        })
                }

                return { key, ...(params.length > 0 && { params }), value: '' as any }
            })

        return keysOperators
    }

    // UC
    log<T extends string = Template>(message?: any, config?: ConsoleConfig<T>, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig(config, keysValues)

        return this.print(message, 'log', _config, _keysValues)
    }
    warn<T extends string = Template>(message?: any, config?: ConsoleConfig<T>, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig(config, keysValues)

        return this.print(message, 'warn', _config, _keysValues)
    }
    error<T extends string = Template>(message?: any, config?: ConsoleConfig<T>, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig(config, keysValues)

        return this.print(message, 'error', _config, _keysValues)
    }
    info<T extends string = Template>(message?: any, config?: ConsoleConfig<T>, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig(config, keysValues)

        return this.print(message, 'info', _config, _keysValues)
    }

    clear() {
        Console.clear()
    }

    colorizeText(text: ColorsConsoleType, args: ColorizeArgs) {
        return colorizeText(text, args)
    }

    static clear() {
        this.native.clear()
    }
}
