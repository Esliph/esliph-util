export type ErrorResultInfo = {
    title: string
    message: string
    description?: string
}

export class ErrorResult implements ErrorResultInfo {
    readonly title: string
    readonly message: string
    readonly description?: string

    constructor({ message, title, description }: ErrorResultInfo) {
        this.title = title
        this.message = message
        this.description = description
    }
}
