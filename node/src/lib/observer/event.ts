export type ActionModel<Args = any> = (data: Args) => void | Promise<void>

export type EventModel = {
    code: number
    eventName: string
    action: ActionModel
    order?: number
}

export class Event implements EventModel {
    public code: number
    public action: ActionModel
    public eventName: string
    public order?: number

    constructor({ action, code, eventName, order }: EventModel) {
        this.code = code
        this.action = action
        this.eventName = eventName
        this.order = order
    }

    async performAction(data: any) {
        const response = await this.action(data)

        return response
    }
}