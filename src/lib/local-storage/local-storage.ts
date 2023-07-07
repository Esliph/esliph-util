import _ from 'lodash'
import { LocalStorageMemory } from './memory'

type Storage = LocalStorageMemory

export type LocalStorageOptions = {
    useMemory?: boolean
    useMemoryWhenLocalNotEnable?: boolean
}

const DEFAULT_LOCAL_STORAGE_OPTIONS: LocalStorageOptions = {
    useMemoryWhenLocalNotEnable: true,
}

export class LocalStorage {
    static storageMemory: Storage = new LocalStorageMemory()
    static storageLocal: Storage = new LocalStorageMemory()
    options: LocalStorageOptions

    constructor(options?: LocalStorageOptions) {
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
            const value = this.getStorage().getItem(key)

            if (!value) {
                return null
            }

            return value
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

    updateOptions(options: LocalStorageOptions) {
        this.options = _.merge({}, DEFAULT_LOCAL_STORAGE_OPTIONS, this.options, options)
    }

    private getStorage(): Storage {
        return !this.options.useMemory || !this.options.useMemoryWhenLocalNotEnable ? LocalStorage.storageLocal : LocalStorage.storageMemory
    }
}
