import { Action, EventModel } from './model'

export class Event<Name extends string, Args = any> implements EventModel<Name, Args> {
    readonly code: number
    readonly name: Name
    readonly action: Action<Args>

    constructor({ action, code, name }: EventModel<Name, Args>) {
        this.action = action
        this.code = code
        this.name = name
    }
}
