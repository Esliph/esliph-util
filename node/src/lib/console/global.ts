import { EnumColorsBackground, EnumColorsStyles, EnumColorsText } from '../../util/color'

export const EnumTemplateCharacters = {
    open: '<',
    close: '>',
    ignore: '!',
    separatorStyles: ';',
    param: '?',
    separatorParam: '&',
    receive: '=',
} as const

export const EnumTemplateParams = {
    color: 'color',
    background: 'background',
    styles: 'styles',
    value: 'value',
} as const

export const EnumCliColors = {
    color: Object.keys(EnumColorsText),
    background: Object.keys(EnumColorsBackground),
    styles: Object.keys(EnumColorsStyles),
} as const

export const EnumConsoleMethod = {
    info: 'info',
    log: 'log',
    error: 'error',
    warn: 'warn',
} as const

export type ConsoleMethod = keyof typeof EnumConsoleMethod

export type GenericType<T extends string, U = any> = { [x in T]: U }

export type NativeTypes = Date | number | string | boolean | object | any[] | Function | bigint | null | undefined

export type KeysFormTemplate<T extends string> = GenericType<T, NativeTypes | ((args: { method: ConsoleMethod; message: any }) => NativeTypes)>

export type TemplateKeys<S extends string> = S extends `${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<RestAfter>
    : S extends `${infer RestBefore}${typeof EnumTemplateCharacters.open}${infer KeyName}${typeof EnumTemplateCharacters.close}${infer RestAfter}`
    ? KeyName | TemplateKeys<`${RestBefore}${RestAfter}`>
    : never

export type FilterKeysName<T extends string> = T extends `${typeof EnumTemplateCharacters.ignore}${infer _}` ? never : T

export type ExtractKeysName<T extends string> = T extends `${infer Value}${typeof EnumTemplateCharacters.param}${infer _}` ? Value : T

export type ExtractKeys<T extends string> = FilterKeysName<ExtractKeysName<TemplateKeys<T>>>

export type KeysInput<T extends string> = Partial<KeysFormTemplate<ExtractKeys<T>>>

export type ConsoleEvents = { [x in ConsoleMethod]: string }



