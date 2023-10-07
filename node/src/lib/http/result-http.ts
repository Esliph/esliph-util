import { ErrorResult, ErrorResultInfo } from '../error'
import { ResultModel, ResultModelBase } from '../result'

export type ResultHttpModel<ResultValueModel = any> = { dateTime: Date; timeResponse: number } & ResultModel<ResultValueModel>

export class ResultHttp<ResultValueModel = any> extends ResultModelBase<ResultValueModel> {
    protected dateTime: Date
    protected timeResponse: number

    constructor({ error, ok, status, value, dateTime, timeResponse }: ResultHttpModel<ResultValueModel>) {
        super({ error, ok, status, value })

        this.dateTime = dateTime
        this.timeResponse = timeResponse
    }

    static success<ResultValueModel = any>(successInfo: ResultValueModel, times?: { dateTime?: Date; timeResponse?: number }, statusCode = 200) {
        const timesM = { dateTime: new Date(Date.now()), timeResponse: 0, ...times }
        return new ResultHttp<ResultValueModel>({
            ok: true,
            status: statusCode,
            value: successInfo,
            error: null,
            dateTime: timesM.dateTime,
            timeResponse: timesM.timeResponse,
        })
    }

    static failure<ResultValueModel = any>(errorInfo: ErrorResultInfo, times?: { dateTime?: Date; timeResponse?: number }, statusCode = 400) {
        const timesM = { dateTime: new Date(Date.now()), timeResponse: 0, ...times }
        return new ResultHttp<ResultValueModel>({
            ok: false,
            status: statusCode,
            error: new ErrorResult(errorInfo),
            value: null,
            dateTime: timesM.dateTime,
            timeResponse: timesM.timeResponse,
        })
    }

    static inherit<ResultValueModelInherited = any>({ ok, status, value, error, dateTime, timeResponse }: ResultHttpModel<ResultValueModelInherited>) {
        return new ResultHttp<ResultValueModelInherited>({ ok, status, error, value, dateTime, timeResponse })
    }

    getResponse() {
        return { ...super.getResponse(), dateTime: this.dateTime }
    }

    getDateTime() {
        return this.dateTime
    }

    getTimeResponse() {
        return this.timeResponse
    }
}
