export type ActionModel<Args = any, Res = void> = (data: Args) => Res | Promise<Res>

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

    async performAction<Res = any>(data: any): Promise<Res> {
        const response = await this.action(data)

        return response as any
    }
}
