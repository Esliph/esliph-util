declare module '@esliph/util' {
    export type TError = {
        title: string
        message: { message: string; origin: string }[]
    }

    export declare class ErrorGeneral implements TError {
        title: TError['title']
        message: TError['message']
        constructor({ message, title }: TError)
    }

    export const randomId = {
        int: () => number,
        uuidv4: () => string,
    }

    export const hash: {
        generate: (text: string) => Promise<string>
        compare: (hash: string, ref: string) => Promise<boolean>
    }

    export declare class Result<T> {
        private ok
        private status
        private value?
        private error?
        private constructor()
        static failure<T>(errorInfo: TError, statusCode: number): Result<T>
        static success<T>(successInfo: T, statusCode?: number): Result<T>
        isSuccess(): boolean
        getResponse(): T
        getError(): ErrorGeneral
        getStatus(): number
        getResult(): {
            ok: boolean
            status: number
            value: T
            error: ErrorGeneral
        }
    }

    export function getEnv<T>(args: { name: string; default?: T; forceDefault?: boolean; production?: boolean }): string | NonNullable<T>

    export function getFlag(flagName: string): string

    export function getAllFlags(): { [x: string]: string }

    export type LocalStorageOptions = {
        inMemory?: boolean
    }

    export function LocalStorage(options?: LocalStorageOptions): {
        createItem: (key: string, value: any) => boolean
        updateItem: (key: string, value: any) => boolean
        removeItem: (key: string) => boolean
        getItem: <T>(key: string) => T | null
        clear: () => boolean
    }

    export type ConsoleArgument = number | string | boolean | object | any[] | Function | bigint | null | undefined
    export type ConsoleMethod = 'info' | 'log' | 'error' | 'warn'
    export type ConsoleConfig = {
        showDataTime?: boolean
        pidName?: string
        showPid?: boolean
        showPidCode?: boolean
        showPidName?: boolean
        levels?: boolean | ConsoleMethod | ConsoleMethod[]
    }

    export type ColorsTextEnable =
        | 'default'
        | 'black'
        | 'red'
        | 'redLight'
        | 'green'
        | 'greenLight'
        | 'yellow'
        | 'yellowLight'
        | 'blue'
        | 'blueLight'
        | 'magenta'
        | 'magentaLight'
        | 'cyan'
        | 'cyanLight'
        | 'white'
        | 'grey'
        | 'greyLight'
        | 'purple'
        | 'purpleLight'
    export type ColorsBackgroundEnable =
        | 'default'
        | 'black'
        | 'blackLight'
        | 'red'
        | 'redLight'
        | 'green'
        | 'greenLight'
        | 'yellow'
        | 'yellowLight'
        | 'blue'
        | 'blueLight'
        | 'magenta'
        | 'magentaLight'
        | 'cyan'
        | 'cyanLight'
        | 'white'
        | 'whiteLight'
        | 'grey'
        | 'greyLight'
        | 'purple'
        | 'purpleLight'
    export type ColorsTextStyles = 'default' | 'bold' | 'italic' | 'underline' | 'strikethrough'
    export type ColorsConsoleType = number | string | boolean | object | any[] | Function | bigint | null | undefined
    export type ColorizeArgs = { color: ColorsTextEnable; background?: ColorsBackgroundEnable; styles?: ColorsTextStyles | ColorsTextStyles[] }

    export declare class Console {
        constructor(args?: { context?: string; config?: ConsoleConfig; clearMessage?: boolean })
        getContext(): string | undefined
        log(message: ConsoleArgument, context?: string): void
        error(message: ConsoleArgument, context?: string): void
        warn(message: ConsoleArgument, context?: string): void
        info(message: ConsoleArgument, context?: string): void
        colorizeText(text: ColorsConsoleType, args: ColorizeArgs): void
        clear(): void
        static clear(): void
    }
}
