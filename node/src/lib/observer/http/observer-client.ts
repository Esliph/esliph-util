import { Observer } from '../observer'
import { HttpMethods } from './constants'

export type OptionsClient = {}

export class ObserverClient {
    protected observer: Observer

    constructor(private optionsClient: OptionsClient = {}) {
        this.observer = new Observer()
    }

    async get(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.GET, `${eventName}`, data)

        return response
    }

    async post(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.POST, `${eventName}`, data)

        return response
    }

    async put(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.PUT, `${eventName}`, data)

        return response
    }

    async patch(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.PATCH, `${eventName}`, data)

        return response
    }

    async delete(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.DELETE, `${eventName}`, data)

        return response
    }

    async head(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.HEAD, `${eventName}`, data)

        return response
    }

    async options(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.OPTIONS, `${eventName}`, data)

        return response
    }

    private getFullOptionsClients(options: Partial<OptionsClient> = {}) {
        return {
            ...this.optionsClient,
            ...options,
        } as OptionsClient
    }

    private async performEvent(method: HttpMethods, eventName: string, data?: any, options?: OptionsClient) {
        const event = this.observer.getEventByEventName(`${method}:${eventName}`)

        if (!event) {
            throw new Error(`Method ${method} "${eventName}" not found`)
        }

        const fullOptions = this.getFullOptionsClients(options)

        const response = await event.performAction(data || {}, fullOptions)

        return response
    }
}
