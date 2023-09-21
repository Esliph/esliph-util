export type ActionModel<Data = any, Req = any, Res = void> = (data: Data, options?: Req) => Res | Promise<Res>

export type EventModel = {
    readonly code: number
    readonly eventName: string
    readonly action: ActionModel
}

export class Event implements EventModel {
    public readonly code: number
    public readonly action: ActionModel
    public readonly eventName: string

    constructor({ action, code, eventName }: EventModel) {
        this.code = code
        this.action = action
        this.eventName = eventName
    }

    async performAction<Req = any, Res = any>(data: any, req: Req): Promise<Res> {
        const response = await this.action(data, req)

        return response as any
    }
}
