export type ActionModel<Args = any> = (data: Args) => void | Promise<void>

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

    async performAction(data: any) {
        const response = await this.action(data)

        return response
    }
}