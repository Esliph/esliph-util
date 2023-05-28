import { TError } from '@esliph/util'
import { ErrorGeneral } from '@lib/error'

export class Result<T = any> {
    private ok: boolean
    private status: number
    private value?: T
    private error?: ErrorGeneral

    private constructor({ ok, status, value, error, }: { ok: true; value: T; status: number; error?: undefined } | { ok: false; error: ErrorGeneral; status: number; value?: undefined }) {
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

    static failure<T>(errorInfo: TError, statusCode: number) {
        return new Result<T>({ ok: false, error: new ErrorGeneral(errorInfo), status: statusCode })
    }

    isSuccess() {
        return this.ok
    }

    getResponse() {
        return this.value as T
    }

    getError() {
        return this.error as ErrorGeneral
    }

    getStatus() {
        return this.status
    }

    getResult() {
        return { ok: this.ok, status: this.status, value: this.value as T, error: this.error as ErrorGeneral }
    }
}