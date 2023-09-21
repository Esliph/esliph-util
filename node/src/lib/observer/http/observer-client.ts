import { Observer } from '../observer'
import { HttpMethods } from './constants'

export class ObserverClient {
    protected observer: Observer

    constructor() {
        this.observer = new Observer()
    }

    async get(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.GET, `${eventName}`, data)

        return response
    }

    async post(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.POST, `${eventName}`, data)

        return response
    }

    async put(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.PUT, `${eventName}`, data)

        return response
    }

    async patch(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.PATCH, `${eventName}`, data)

        return response
    }

    async delete(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.DELETE, `${eventName}`, data)

        return response
    }

    async head(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.HEAD, `${eventName}`, data)

        return response
    }

    async options(eventName: string, data?: any) {
        const response = await this.performEvent(HttpMethods.OPTIONS, `${eventName}`, data)

        return response
    }

    private async performEvent(method: HttpMethods, eventName: string, data?: any) {
        const event = this.observer.getEventByEventName(`${method}:${eventName}`)

        if (!event) {
            throw new Error(`Method ${method} "${eventName}" not found`)
        }

        const response = await event.performAction(data || {})

        return response
    }
}
