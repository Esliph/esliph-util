import _ from 'lodash'
import { DEFAULT_METHODS_VALUES, GLOBAL_DEFAULT_TEMPLATES, KeysValueTemplateMethods, TEMPLATE_ERROR, TEMPLATE_INFO, TEMPLATE_WARN, TemplatesMethods } from './default'
import { ConsoleMethod, EnumTemplateCharacters } from './global'

export const CAPTURE_KEY = new RegExp(`${EnumTemplateCharacters.open}(?!/?![a-zA-Z0-9])([^${EnumTemplateCharacters.close}]+)${EnumTemplateCharacters.close}`, 'g')

export type ConsoleConfig<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
> = {
    templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>
    levels?: ConsoleMethod[]
}

export const getRegexForCapture = (target: string) => {
    return new RegExp(
        `${EnumTemplateCharacters.open}(?${EnumTemplateCharacters.ignore}\\${EnumTemplateCharacters.ignore})[^${EnumTemplateCharacters.close}]*${target}[^${EnumTemplateCharacters.close}]*${EnumTemplateCharacters.close}`,
        'g'
    )
}

export function getDefaultConfig<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
>(
    args: { templates?: TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> } = {},
    methodsValue: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {}
) {
    const config: ConsoleConfig<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = {
        templates:
            args && args.templates
                ? _.merge({}, GLOBAL_DEFAULT_TEMPLATES, args.templates)
                : (GLOBAL_DEFAULT_TEMPLATES as TemplatesMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>),
        levels: ['error', 'info', 'log', 'warn'],
    }

    const mv: KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo> = _.merge(
        {},
        DEFAULT_METHODS_VALUES,
        methodsValue
    ) as KeysValueTemplateMethods<TemplateLog, TemplateError, TemplateWarn, TemplateInfo>

    return { config, methodsValue: mv }
}