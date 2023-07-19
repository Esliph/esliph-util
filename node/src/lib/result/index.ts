import { ErrorResultInfo, ErrorResult } from '../error'

export type ResultModel<ResultValueModel = any> = {
    ok: boolean
    status: number
    value: ResultValueModel | null
    error: ErrorResult | null
}

export class Result<ResultValueModel = any> {
    private readonly ok: boolean
    private readonly status: number
    private readonly value: ResultValueModel | null
    private readonly error: ErrorResult | null

    private constructor({ ok, status, value, error }: ResultModel<ResultValueModel>) {
        this.ok = ok
        this.status = status
        this.value = value
        this.error = error
    }

    static success<ResultValueModel = any>(successInfo: ResultValueModel, statusCode = 200) {
        return new Result<ResultValueModel>({ ok: true, status: statusCode, value: successInfo, error: null })
    }

    static failure<ResultValueModel = any>(errorInfo: ErrorResultInfo, statusCode = 400) {
        return new Result<ResultValueModel>({ ok: false, status: statusCode, error: new ErrorResult(errorInfo), value: null })
    }

    static inherit<ResultValueModelInherited = any>({ ok, status, value, error }: ResultModel<ResultValueModelInherited>) {
        return new Result<ResultValueModelInherited>({ ok, status, error, value })
    }

    isSuccess() {
        return this.ok
    }

    getValue() {
        return this.value as ResultValueModel
    }

    getError() {
        return this.error as ErrorResult
    }

    getStatus() {
        return this.status
    }

    getResponse() {
        return { ok: this.ok, status: this.status, value: this.value as ResultValueModel, error: this.error as ErrorResult }
    }
}
