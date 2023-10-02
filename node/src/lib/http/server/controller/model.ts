export type EventsModel = {
    [context: string]: {
        [router: string]: {
            body: any
            response: any
        }
    }
}
