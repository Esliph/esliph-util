import { ErrorResult } from '../../../error'
import { Result, ResultModel } from '../../../result'

export type ResponseModel<Res = any> = {
    status: number
    data: Res
}

export class Response<Res = any> {
    private state: ResultModel<Res>

    constructor() {
        this.state = {
            ok: true,
            error: null,
            value: null,
            status: 200,
        }
    }

    status(statusCode: number) {
        this.state.status = statusCode

        return this
    }

    send(value: Res) {
        this.state.value = value
        this.state.ok = true
    }

    error(error: ErrorResult) {
        this.state.error = error
        this.state.ok = false
    }

    getResponse() {
        return Result.inherit(this.state)
    }

    hasResponse() {
        return !!this.state.error || !!this.state.value
    }
}
