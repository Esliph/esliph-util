import { ObserverRepository } from './repository'

export class ObserverController {
    protected static readonly repository = new ObserverRepository({ isolated: true })

    private get repository() {
        return ObserverController.repository
    }
}
