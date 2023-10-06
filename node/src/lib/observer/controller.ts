import { ObserverRepository } from './repository'
import { Action, EventModel } from './model'
import { Event } from './event'
import { randomIdIntWithDate } from '../random'

export type EventCreateArgs = {
    context?: string
    name: string
    action: Action
}

export class ObserverController {
    protected static readonly repository = new ObserverRepository({ isolated: true })
    private readonly repositoryLocal: ObserverRepository | null

    constructor(repositoryLocal: ObserverRepository | null = null) {
        this.repositoryLocal = repositoryLocal
    }

    createEvent({ action, name, context = '' }: EventCreateArgs) {
        const code = randomIdIntWithDate()
        const event: EventModel<typeof name> = { code, action, name, context }

        this.repository.create({
            data: { ...event },
        })

        return event.code
    }

    removeEvent(code: number) {
        this.repository.delete({
            where: { code: { equals: code } },
        })
    }

    async performEvent(name: string, args: any, context = '') {
        const events = this.repository
            .findMany({
                where: { name: { equals: name }, ...(!!context && { context: { equals: context } }) },
            })
            .map(event => new Event(event))

        events.map(async event => {
            await this.performEventAction(event, args)
        })
    }

    protected async performEventAction<Name extends string, Args>(event: Event<Name, Args>, data: any) {
        await event.action(data)
    }

    protected get repository() {
        if (this.repositoryLocal) {
            return this.repositoryLocal
        }
        return ObserverController.repository
    }
}
