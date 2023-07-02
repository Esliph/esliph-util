import { ColorizeArgs, ColorsConsoleType, EnumColorsBackground, EnumColorsStyles, EnumColorsText, colorizeText } from '@util/color'

/* eslint no-unused-expressions: ["off"] */

function deepMerge(target: any, ...sources: any[]): any {
    if (!sources.length) return target

    const source = sources.shift()

    if (source instanceof Object && source !== null && !Array.isArray(source)) {
        if (target instanceof Object && target !== null && !Array.isArray(target)) {
            for (let key in source) {
                if (key in source) {
                    if (source[key] === undefined) {
                        continue // Ignora propriedade undefined
                    }
                    if (source[key] instanceof Object && source[key] !== null && !Array.isArray(source[key])) {
                        if (!(key in target) || typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                            target[key] = {}
                        }
                        deepMerge(target[key], source[key])
                    } else {
                        target[key] = source[key]
                    }
                }
            }
        } else {
            target = source
        }
    }

    return deepMerge(target, ...sources)
}


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

const TEMPLATE_LOG = '<log> <prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_ERROR = '<error> <prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=red>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_WARN = '<warn> <prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=yellow&color=black>  <context?color=green&styles=bold>: <message>'
const TEMPLATE_INFO = '<info> <prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=white>  <context?color=green&styles=bold>: <message>'

const GLOBAL_DEFAULT_TEMPLATES = {
    log: TEMPLATE_LOG,
    error: TEMPLATE_ERROR,
    warn: TEMPLATE_WARN,
    info: TEMPLATE_INFO,
}

type TemplatesMethods<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO> = { [x in TEnumConsoleMethod]?: x extends 'log' ? TemplateLog : x extends 'error' ? TemplateError : x extends 'warn' ? TemplateWarn : x extends 'info' ? TemplateInfo : never }

type KeysValueTemplateMethods<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO> = { [x in TEnumConsoleMethod]?: x extends 'log' ? KeysInput<TemplateLog> : x extends 'error' ? KeysInput<TemplateError> : x extends 'warn' ? KeysInput<TemplateWarn> : x extends 'info' ? KeysInput<TemplateInfo> : never }

// Config
type ConsoleConfig<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
> = {
    templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
}

const getRegexForCapture = (target: string) => {
    return new RegExp(`${EnumTemplateCharacters.open}(?${EnumTemplateCharacters.ignore}\\${EnumTemplateCharacters.ignore})[^${EnumTemplateCharacters.close}]*${target}[^${EnumTemplateCharacters.close}]*${EnumTemplateCharacters.close}`, 'g')
}

const DEFAULT_TEMPLATE = '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>'

type IDefaultTemplate = typeof DEFAULT_TEMPLATE

const DEFAULT_TEMPLATE_KEYS_NAME: KeysInput<IDefaultTemplate> = {
    dateTime: () => dateTimeFormatter.format(new Date(Date.now())).replace(', ', ' '),
    method: ({ method }) => ` ${method.toUpperCase()} `,
    message: ({ message }) => message,
    pidCode: process.pid,
}

const DEFAULT_METHODS_VALUES: KeysValueTemplateMethods = {
    log: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    error: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    warn: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    info: { ...DEFAULT_TEMPLATE_KEYS_NAME },
}

function getDefaultConfig<
    TemplateLog extends string = typeof TEMPLATE_LOG,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
>(args: { template?: TemplateLog, templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> } = {}, keysValues: KeysInput<TemplateLog> = {}, methodsValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {}) {
    const config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {
        templates: args && args.templates ? args.templates : (GLOBAL_DEFAULT_TEMPLATES as TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>),
    }

    const kv: KeysInput<TemplateLog> = { ...DEFAULT_TEMPLATE_KEYS_NAME, ...keysValues } as KeysInput<TemplateLog>

    const mv: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = { ...DEFAULT_METHODS_VALUES, ...methodsValue } as KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>

    return { config, keysValues: kv, methodsValue: mv }
}

export class Console<
    TemplateLog extends string = typeof TEMPLATE_LOG,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO,
> {
    private config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    private methodsValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    private keysValues: KeysInput<TemplateLog>
    protected native: globalThis.Console = console
    static readonly native: globalThis.Console = console

    constructor(args: { template?: TemplateLog, templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> } | null = {}, keysValues: KeysInput<TemplateLog> = {}, methodsValue?: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>) {
        this.config = { ...getDefaultConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>(args || {}, keysValues || {}, methodsValue || {}).config, ...args }
        this.keysValues = { ...getDefaultConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>(args || {}, keysValues || {}, methodsValue || {}).keysValues, ...keysValues }
        this.methodsValue = { ...getDefaultConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>(args || {}, keysValues || {}, methodsValue || {}).methodsValue, ...methodsValue }
    }

    // Util
    private getConfig<
        TemplateLog extends string = typeof TEMPLATE_LOG,
        TemplateError extends string = typeof TEMPLATE_ERROR,
        TemplateWarn extends string = typeof TEMPLATE_WARN,
        TemplateInfo extends string = typeof TEMPLATE_INFO>(options: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {}, keysValues: KeysInput<TemplateLog> = {}, methodsValue?: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>) {
        const configs = [this.config, options]
        const kv = [this.keysValues, keysValues]
        const mv = [this.methodsValue, methodsValue]

        const config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = deepMerge({}, ...configs)
        const keysValue: GenericType<TemplateLog> = deepMerge({}, ...kv)
        const methodValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = deepMerge({}, ...mv)

        return { config, keysValues: keysValue, methodsValue: methodValue }
    }

    private getOccurrenceForCapture(text: string, selector: string) {
        const selectorRegex = getRegexForCapture(selector)
        let match = selectorRegex.exec(text)

        return match ? { value: match[0], initial: match.index, final: selectorRegex.lastIndex } : null
    }

    // Process
    private print<T extends string>(message: any, method: TEnumConsoleMethod, template: T, keysValues: GenericType<T, any>) {
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

        const templateProcessed = this.processTemplate({ template, keysValues: kv })

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
    log<T extends string = TemplateLog>(message?: any, template?: { template?: T }, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues, methodsValue } = this.getConfig({ templates: { log: template?.template } }, keysValues, { log: keysValues })

        if (!_config.templates || !_config.templates['log']) { return }

        return this.print(message, 'log', _config.templates['log'], _keysValues)
    }
    warn<T extends string = TemplateWarn>(message?: any, template?: { template?: T }, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig({ templates: { warn: template?.template } }, keysValues, { warn: keysValues })

        if (!_config.templates || !_config.templates['warn']) { return }

        return this.print(message, 'warn', _config.templates['warn'], _keysValues)
    }
    error<T extends string = TemplateError>(message?: any, template?: { template?: T }, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig({ templates: { error: template?.template } }, keysValues, { error: keysValues })

        if (!_config.templates || !_config.templates['error']) { return }

        return this.print(message, 'error', _config.templates['error'], _keysValues)
    }
    info<T extends string = TemplateInfo>(message?: any, template?: { template?: T }, keysValues?: KeysInput<T>) {
        const { config: _config, keysValues: _keysValues } = this.getConfig({ templates: { info: template?.template } }, keysValues, { info: keysValues })

        if (!_config.templates || !_config.templates['info']) { return }

        return this.print(message, 'info', _config.templates['info'], _keysValues)
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
