export type TError = {
    title: string
    message: { message: string, origin?: string }[]
}

export declare class ErrorGeneral implements TError {
    title: string
    message: {
        message: string;
        origin?: string;
    }[]
    constructor({ message, title }: TError);
}