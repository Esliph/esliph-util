import { LocalStorageOptions } from '@esliph/util'

const dataLocal: Storage = (function () {
    const storage: { key: string, value: any }[] = []

    let length = storage.length

    const clear = () => {
        storage.splice(0, storage.length)

        length = storage.length
    }

    const getItem = (key: string) => { return storage.find(d => { return d.key == key })?.value }

    const removeItem = (key: string) => {
        const index = (function () {
            for (let i = 0; i < storage.length; i++) {
                const element = storage[i]

                if (element.key == key) { return i }
            }

            return -1
        }())

        if (index < 0) { return }

        storage.splice(index, 1)

        length = storage.length
    }

    const setItem = (key: string, value: any) => {
        removeItem(key)

        storage.push({ key, value })

        length = storage.length
    }

    const key = (i: number) => {
        return storage[i].value
    }

    return {
        clear,
        getItem,
        removeItem,
        setItem,
        length: length,
        key
    }
}())

const getStorage: (local?: boolean) => Storage = (local = false) => {
    return !local ? localStorage : dataLocal
}

export function LocalStorage(options?: LocalStorageOptions) {
    const createItem = (key: string, value: any) => {
        try {
            removeItem(key)
            getStorage(options?.inMemory).setItem(key, value || '')
            return true
        } catch (err) {
            return false
        }
    }

    const updateItem = (key: string, value: any) => {
        try {
            removeItem(key)
            createItem(key, value)
            return true
        } catch (err) {
            return false
        }
    }

    const removeItem = (key: string) => {
        try {
            getStorage(options?.inMemory).removeItem(key)
            return true
        } catch (err) {
            return false
        }
    }

    const getItem: <T>(key: string) => T | null = (key: string) => {
        try {
            const value = getStorage(options?.inMemory).getItem(key)

            if (!value) { return null }

            return value
        } catch (err) {
            return null
        }
    }

    const clear = () => {
        try {
            getStorage(options?.inMemory).clear()
            return true
        } catch (err) {
            return false
        }
    }

    return {
        createItem,
        updateItem,
        removeItem,
        getItem,
        clear,
    }
}