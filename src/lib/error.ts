export type ErrorLiphInfo = {
    title: string
    message: { message: string; origin?: string }[]
}

export class ErrorLiph implements ErrorLiphInfo {
    title: string
    message: { message: string, origin?: string }[]

    constructor({ message, title }: ErrorLiphInfo) {
        this.title = title
        this.message = message
    }
}
