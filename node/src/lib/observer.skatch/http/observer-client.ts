import { ErrorResult } from '../../error'
import { Observer } from '../observer'
import { HttpMethods } from './constants'

export type OptionsClient = any

export class ObserverClient {
    protected observer: Observer

    constructor(private prefix = '', private optionsClient: OptionsClient = {}) {
        this.observer = new Observer()
    }

    async get<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.GET, `${eventName}`, data, options)

        return response as T
    }

    async post<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.POST, `${eventName}`, data, options)

        return response as T
    }

    async put<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.PUT, `${eventName}`, data, options)

        return response as T
    }

    async patch<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.PATCH, `${eventName}`, data, options)

        return response as T
    }

    async delete<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.DELETE, `${eventName}`, data, options)

        return response as T
    }

    async head<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.HEAD, `${eventName}`, data, options)

        return response as T
    }

    async options<T = any>(eventName: string, data?: any, options?: OptionsClient) {
        const response = await this.performEvent(HttpMethods.OPTIONS, `${eventName}`, data, options)

        return response as T
    }

    private getFullOptionsClients(options: Partial<OptionsClient> = {}) {
        return {
            ...this.optionsClient,
            ...options,
        } as OptionsClient
    }

    private async performEvent(method: HttpMethods, eventName: string, data?: any, options?: OptionsClient) {
        const event = this.observer.getEventByEventName(`${method}:${this.prefix}${eventName}`)

        if (!event) {
            throw new ErrorResult({ title: '', message: `Method ${method} "${this.prefix}${eventName}" not found` })
        }

        const fullOptions = this.getFullOptionsClients(options)

        const response = await event.performAction(data || {}, fullOptions)

        return response
    }
}
