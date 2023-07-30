import { ErrorResult } from "../error";

export interface ResultExceptionModel extends ErrorResult {
    status?: number
}

export interface ResultExceptionArgs {
    title?: string
    message: string
    description?: string
    status?: number
}

export class ResultException extends Error implements ResultExceptionModel {
    readonly message: string
    readonly status?: number
    readonly stack?: string
    readonly title: string
    readonly description?: string

    constructor({ message, description, title, status }: ResultExceptionArgs) {
        super()

        this.message = message
        this.description = description
        this.title = title || this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') || 'Error'
        this.status = status
    }

    getError() { return { message: this.message, title: this.title, description: this.description, status: this.status } }
    getTitle() { return this.title }
    getMessage() { return this.message }
    getDescription() { return this.description || null }
    getStatus() { return this.status }
    getStack() { return this.stack || null }
}
