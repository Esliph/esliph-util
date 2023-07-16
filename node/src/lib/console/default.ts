import { ConsoleMethod, KeysInput } from './global'

export const DateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour12: false,
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
    calendar: 'gregory',
})

export const TEMPLATE_LOG =
    '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=blue>  <context?color=green&styles=bold>: <message>'
export const TEMPLATE_ERROR =
    '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=red>  <context?color=green&styles=bold>: <message>'
export const TEMPLATE_WARN =
    '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=yellow&color=black>  <context?color=green&styles=bold>: <message>'
export const TEMPLATE_INFO =
    '<prefix?value="#"&styles=italic> [<pidName?value="Esliph"&color=green&styles=italic;bold>] <pidCode?color=green>  <dateTime>  <method?background=white>  <context?color=green&styles=bold>: <message>'

export type TemplatesMethods<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
> = {
        [x in ConsoleMethod]?: x extends 'log'
        ? TemplateLog
        : x extends 'error'
        ? TemplateError
        : x extends 'warn'
        ? TemplateWarn
        : x extends 'info'
        ? TemplateInfo
        : never
    }

export type KeysValueTemplateMethods<
    TemplateLog extends string = typeof TEMPLATE_ERROR,
    TemplateError extends string = typeof TEMPLATE_ERROR,
    TemplateWarn extends string = typeof TEMPLATE_WARN,
    TemplateInfo extends string = typeof TEMPLATE_INFO
> = {
        [x in ConsoleMethod]?: x extends 'log'
        ? KeysInput<TemplateLog>
        : x extends 'error'
        ? KeysInput<TemplateError>
        : x extends 'warn'
        ? KeysInput<TemplateWarn>
        : x extends 'info'
        ? KeysInput<TemplateInfo>
        : never
    }

export const GLOBAL_DEFAULT_TEMPLATES = {
    log: TEMPLATE_LOG,
    error: TEMPLATE_ERROR,
    warn: TEMPLATE_WARN,
    info: TEMPLATE_INFO,
}

export const DEFAULT_TEMPLATE_KEYS_NAME: KeysInput<typeof TEMPLATE_LOG> = {
    dateTime: () => DateTimeFormatter.format(new Date(Date.now())).replace(', ', ' '),
    method: ({ method }) => ` ${method.toUpperCase()} `,
    message: ({ message }) => message,
    pidCode: process.pid,
}

export const DEFAULT_METHODS_VALUES: KeysValueTemplateMethods = {
    log: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    error: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    warn: { ...DEFAULT_TEMPLATE_KEYS_NAME },
    info: { ...DEFAULT_TEMPLATE_KEYS_NAME },
}