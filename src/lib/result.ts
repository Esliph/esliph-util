import { ErrorLiphInfo } from './error'
import { ErrorLiph } from './error'

export class Result<T = any> {
    private ok: boolean
    private status: number
    private value?: T
    private error?: ErrorLiph

    private constructor({ ok, status, value, error, }: { ok: true; value: T; status: number; error?: undefined } | { ok: false; error: ErrorLiph; status: number; value?: undefined }) {
        this.ok = ok
        this.status = status
        if (ok) {
            this.value = value
        } else {
            this.error = error
        }
    }

    static success<T>(successInfo: T, statusCode = 200) {
        return new Result<T>({ ok: true, status: statusCode, value: successInfo })
    }

    static failure<T>(errorInfo: ErrorLiphInfo, statusCode: number) {
        return new Result<T>({ ok: false, error: new ErrorLiph(errorInfo), status: statusCode })
    }

    isSuccess() {
        return this.ok
    }

    getResponse() {
        return this.value as T
    }

    getError() {
        return this.error as ErrorLiph
    }

    getStatus() {
        return this.status
    }

    getResult() {
        return { ok: this.ok, status: this.status, value: this.value as T, error: this.error as ErrorLiph }
    }
}