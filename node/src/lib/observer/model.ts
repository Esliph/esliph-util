export type Action<Args = any> = (args: Args) => void | Promise<void>

export type EventModelArgs = {
    code: number
    name: string
    action: Action
}

export interface EventModel<Name extends string, Args = any> {
    code: number
    name: Name
    action: Action<Args>
}
