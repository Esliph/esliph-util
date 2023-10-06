import { ErrorResultInfo } from '../../../error'
import { ResultHttp, ResultHttpModel } from '../result-http'

export type ResponseModel<Res = any> = ResultHttpModel<Res>

export class Response<Res = any> {
    private state: ResponseModel<Res>

    constructor() {
        this.state = {
            ok: true,
            error: null,
            value: null,
            status: 200,
            dateTime: new Date(Date.now()),
            timeResponse: 0,
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

    error(error: ErrorResultInfo) {
        this.state.error = { causes: [], ...error }
        this.state.ok = false
    }

    updateTime(dateTime: Date) {
        this.state.dateTime = dateTime
    }

    updateTimeResponse(timeResponse: number) {
        this.state.timeResponse = Number(timeResponse.toFixed(2))
    }

    getResponse() {
        return ResultHttp.inherit<Res>(this.state)
    }

    hasResponse() {
        return !!this.state.error || !!this.state.value
    }
}
