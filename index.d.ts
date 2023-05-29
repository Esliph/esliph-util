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

    export type TObserver = { handler: <T>(data: T) => void; evt: string; code: number }

    export interface ObserverEvent {
        on: (evt: string, handler: <T>(data: T) => void) => number
        emit: <T>(evt: string, data: T) => void
        removeListener: (code: number) => void
    }

    export const hash = {
        generate: (text: string) => Promise<string>,
        compare: (hash: string, ref: string) => Promise<boolean>,
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
}
