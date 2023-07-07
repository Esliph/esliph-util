export type ErrorEsliphInfo = {
    title: string
    message: { message: string; origin?: string }[]
}

export class ErrorEsliph implements ErrorEsliphInfo {
    title: string
    message: { message: string; origin?: string }[]

    constructor({ message, title }: ErrorEsliphInfo) {
        this.title = title
        this.message = message
    }
}
