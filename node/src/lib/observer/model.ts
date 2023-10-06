export type Action<Args = any> = (args: Args) => void | Promise<void>

export type EventModelArgs = {
    code: number
    name: string
    context: string
    action: Action
}

export interface EventModel<Name extends string, Args = any> {
    code: number
    name: Name
    context: string
    action: Action<Args>
}
