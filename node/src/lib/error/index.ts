export type ErrorResultInfo = {
    title: string
    message: { message: string; origin?: string }[]
}

export class ErrorResult implements ErrorResultInfo {
    readonly title: string
    readonly message: { message: string; origin?: string }[]

    constructor({ message, title }: ErrorResultInfo) {
        this.title = title
        this.message = message
    }
}
