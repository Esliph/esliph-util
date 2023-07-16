import _ from 'lodash'
import { LocalStorageMemory } from './memory'

export type LocalStorageOptions = {
    useMemory: boolean
    useMemoryWhenLocalNotEnable: boolean
}

const DEFAULT_LOCAL_STORAGE_OPTIONS: LocalStorageOptions = {
    useMemoryWhenLocalNotEnable: true,
    useMemory: false
}

export class LocalStorage {
    static storageMemory: Storage = new LocalStorageMemory()
    static storageLocal: Storage = localStorage
    options: LocalStorageOptions

    constructor(options?: Partial<LocalStorageOptions>) {
        this.options = _.merge({}, DEFAULT_LOCAL_STORAGE_OPTIONS, options)
    }

    createItem(key: string, value: any) {
        try {
            this.removeItem(key)
            this.getStorage().setItem(key, value || '')
            return true
        } catch (err) {
            return false
        }
    }

    updateItem(key: string, value: any) {
        try {
            this.removeItem(key)
            this.createItem(key, value)
            return true
        } catch (err) {
            return false
        }
    }

    removeItem(key: string) {
        try {
            this.getStorage().removeItem(key)
            return true
        } catch (err) {
            return false
        }
    }

    getItem<T>(key: string): T | null {
        try {
            const valueItem = this.getStorage().getItem(key) as T

            if (!valueItem) { return null }

            return valueItem
        } catch (err) {
            return null
        }
    }

    clear() {
        try {
            this.getStorage().clear()
            return true
        } catch (err) {
            return false
        }
    }

    updateOptions(options: Partial<LocalStorageOptions>) {
        this.options = _.merge({}, DEFAULT_LOCAL_STORAGE_OPTIONS, this.options, options)
    }

    private getStorage(): Storage {
        if (!this.options.useMemory || !this.options.useMemoryWhenLocalNotEnable) {
            return LocalStorage.storageLocal
        }

        return LocalStorage.storageMemory
    }
}
