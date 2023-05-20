import { TError } from "@@types/error"

export class ErrorGeneral implements TError {
    title: string
    message: { message: string, origin?: string }[]

    constructor({ message, title }: TError) {
        this.title = title
        this.message = message
    }
}
