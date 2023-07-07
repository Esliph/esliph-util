import { LocalStorageMemory } from './memory'

type Storage = LocalStorageMemory

export type LocalStorageOptions = {
    isMemory?: boolean
}

export class LocalStorage {
    static storageMemory: Storage = new LocalStorageMemory()
    static storageLocal: Storage = new LocalStorageMemory()
    options: LocalStorageOptions

    constructor(options?: LocalStorageOptions) {
        this.options = options || {}
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
        this.options = { ...this.options, ...options }
    }

    private getStorage(): Storage {
        return !this.options.isMemory ? LocalStorage.storageLocal : LocalStorage.storageMemory
    }
}
