import _ from 'lodash'
import { ColorizeArgs, ColorsConsoleType, colorizeText } from '../../util/color'
import { ObserverEvent } from '../observer'
import { EnumCliColors, EnumTemplateCharacters, EnumTemplateParams, ConsoleMethod, ConsoleEvents, ExtractKeysName, GenericType, KeysFormTemplate, KeysInput } from './global'
import { TEMPLATE_ERROR, TEMPLATE_INFO, TEMPLATE_LOG, TEMPLATE_WARN, KeysValueTemplateMethods, TemplatesMethods } from './default'
import { ConsoleConfig, getDefaultConfig, getRegexForCapture, CAPTURE_KEY } from './helpers'

/* eslint no-unused-expressions: ["off"] */

export class Console<
    TemplateLog extends string = typeof TEMPLATE_LOG,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
> extends ObserverEvent<'Console', ConsoleEvents> {
    protected config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    protected methodsValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    static readonly native: globalThis.Console = console
    static observer = new ObserverEvent<'Console', ConsoleEvents>('Console')

    constructor(
        args: {
            templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
            methodsValue?: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>['log']
            levels?: boolean | ConsoleMethod | ConsoleMethod[]
        } | null = {},
        methodsValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> | null = {}
    ) {
        super('Console')
        this.config = _.merge({}, getDefaultConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>(args || {}, methodsValue || {}).config, args || {})
        this.methodsValue = _.merge(
            {},
            args && args.methodsValue
                ? {
                    log: args.methodsValue,
                    error: args.methodsValue,
                    warn: args.methodsValue,
                    info: args.methodsValue,
                }
                : {},
            getDefaultConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>(args || {}, methodsValue || {}).methodsValue,
            methodsValue || {}
        )

        if (args) {
            if (typeof args.levels != 'undefined') {
                if (!Array.isArray(args.levels)) {
                    if (typeof args.levels == 'boolean') {
                        this.config.levels = args.levels ? ['error', 'info', 'log', 'warn'] : []
                    } else if (typeof args.levels == 'string') {
                        this.config.levels = [args.levels]
                    }
                } else {
                    this.config.levels = args.levels
                }
            } else {
                this.config.levels = ['error', 'info', 'log', 'warn']
            }
        }
    }

    // Util
    getConfig<
        TemplateLog extends string = typeof TEMPLATE_LOG,
        TemplateError extends string = typeof TEMPLATE_ERROR,
        TemplateWarn extends string = typeof TEMPLATE_WARN,
        TemplateInfo extends string = typeof TEMPLATE_INFO
    >(
        options: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {},
        methodsValue?: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    ) {
        const config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = _.merge({}, this.config, options)
        const methodValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = _.merge({}, this.methodsValue, methodsValue)

        return { config, methodsValue: methodValue }
    }

    private getOccurrenceForCapture(text: string, selector: string) {
        const selectorRegex = getRegexForCapture(selector)
        let match = selectorRegex.exec(text)

        return match ? { value: match[0], initial: match.index, final: selectorRegex.lastIndex } : null
    }

    private isEnablePrint(method: ConsoleMethod) {
        return !!(this.config.levels && this.config.levels.find(mt => mt == method))
    }

    // Process
    private print<T extends string, M extends ConsoleMethod>(
        message: any,
        method: M,
        template: T,
        keysValues: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>[M]
    ) {
        if (!this.isEnablePrint(method)) {
            return
        }

        const values: Partial<GenericType<any>> = {}

        for (const key in keysValues) {
            // @ts-expect-error
            switch (typeof keysValues[key]) {
                case 'function':
                    // @ts-expect-error
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

        Console.native.log(templateProcessed)

        Console.observer.observerCore.emitToEvent(method, templateProcessed)
        this.emitToEvent(method, templateProcessed)

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

            if (index < 0) {
                continue
            }

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

            if (!occurrence) {
                return
            }

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
    log<T extends string = TemplateLog>(message?: any, template: { template?: T } | null = {}, keysValues: KeysInput<T> | null = {}) {
        const { config: _config, methodsValue } = this.getConfig({ templates: { log: template?.template } }, { log: keysValues || {} })

        if (!_config.templates || !_config.templates['log']) {
            return
        }

        // @ts-expect-error
        return this.print(message, 'log', _config.templates['log'], methodsValue['log'])
    }
    warn<T extends string = TemplateWarn>(message?: any, template: { template?: T } | null = {}, keysValues: KeysInput<T> | null = {}) {
        const { config: _config, methodsValue } = this.getConfig({ templates: { warn: template?.template } }, { warn: keysValues || {} })

        if (!_config.templates || !_config.templates['warn']) {
            return
        }

        // @ts-expect-error
        return this.print(message, 'warn', _config.templates['warn'], methodsValue['warn'])
    }
    error<T extends string = TemplateError>(message?: any, template: { template?: T } | null = {}, keysValues: KeysInput<T> | null = {}) {
        const { config: _config, methodsValue } = this.getConfig({ templates: { error: template?.template } }, { error: keysValues || {} })

        if (!_config.templates || !_config.templates['error']) {
            return
        }

        // @ts-expect-error
        return this.print(message, 'error', _config.templates['error'], methodsValue['error'])
    }
    info<T extends string = TemplateInfo>(message?: any, template: { template?: T } | null = {}, keysValues: KeysInput<T> | null = {}) {
        const { config: _config, methodsValue } = this.getConfig({ templates: { info: template?.template } }, { info: keysValues || {} })

        if (!_config.templates || !_config.templates['info']) {
            return
        }

        // @ts-expect-error
        return this.print(message, 'info', _config.templates['info'], methodsValue['info'])
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
