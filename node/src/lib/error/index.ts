export type ErrorResultInfo = {
    title: string
    message: string
    causes?: { message: string; origin?: string }[]
    description?: string
    stack?: string
}

export class ErrorResult implements ErrorResultInfo {
    readonly title: string
    readonly message: string
    readonly description?: string
    readonly causes: { message: string; origin?: string }[]
    readonly stack?: string

    constructor({ message = '', title = '', description = '', causes = [], stack = '' }: ErrorResultInfo) {
        this.title = title
        this.message = message
        this.description = description
        this.causes = causes
        this.stack = stack
    }
}
