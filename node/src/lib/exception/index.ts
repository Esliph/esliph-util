import { ErrorResult } from '../error'
import { ResultModel } from '../result'

export type ResultExceptionModel<T = any> = ResultModel<T>

export interface ResultExceptionArgs {
    title?: string
    message: string
    description?: string
    status?: number
    causes?: { message: string; origin?: string }[]
}

export class ResultException<T = any> extends Error implements ResultExceptionModel<T> {
    readonly message: string
    readonly ok: boolean
    readonly stack?: string
    readonly status: number
    readonly value: any
    readonly error: ErrorResult

    constructor({ message, description, title, status = 0, causes = [] }: ResultExceptionArgs) {
        super()

        this.message = message
        this.status = status
        this.ok = false
        this.value = null
        this.error = {
            causes,
            message,
            title: title || this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') || 'Error',
            description,
        }
    }

    getError() {
        return { descriptions: this.getStack() || '', ...this.error, status: this.status }
    }
    getTitle() {
        return this.error.title
    }
    getMessage() {
        return this.error.message
    }
    getDescription() {
        return this.error.description || null
    }
    getStatus() {
        return this.status
    }
    getStack() {
        return this.stack || null
    }
    getCauses() {
        return this.error.causes
    }
}
