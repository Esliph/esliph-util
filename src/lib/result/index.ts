import { ErrorEsliphInfo } from '../error'
import { ErrorEsliph } from '../error'

export type ResultModel<ResultValueModel = any> = {
    ok: boolean
    status: number
    value: ResultValueModel | null
    error: ErrorEsliph | null
}

export class Result<ResultValueModel = any> {
    private ok: boolean
    private status: number
    private value: ResultValueModel | null
    private error: ErrorEsliph | null

    private constructor({ ok, status, value, error }: ResultModel<ResultValueModel>) {
        this.ok = ok
        this.status = status
        this.value = value
        this.error = error
    }

    static success<ResultValueModel = any>(successInfo: ResultValueModel, statusCode = 200) {
        return new Result<ResultValueModel>({ ok: true, status: statusCode, value: successInfo, error: null })
    }

    static failure<ResultValueModel = any>(errorInfo: ErrorEsliphInfo, statusCode = 400) {
        return new Result<ResultValueModel>({ ok: false, status: statusCode, error: new ErrorEsliph(errorInfo), value: null })
    }

    isSuccess() {
        return this.ok
    }

    getValue() {
        return this.value as ResultValueModel
    }

    getError() {
        return this.error as ErrorEsliph
    }

    getStatus() {
        return this.status
    }

    getResponse() {
        return { ok: this.ok, status: this.status, value: this.value as ResultValueModel, error: this.error as ErrorEsliph }
    }
}
