interface Storage {}

export class LocalStorageMemory implements Storage {
    private static storage: { key: string; value: any }[] = []

    constructor() {}

    setItem(key: string, value: any) {
        this.removeItem(key)
        this.addItem(key, value)
    }

    getItem(keyName: string) {
        const itemByKeyName = this.getItemByKeyName(keyName)

        return itemByKeyName
    }

    clear() {
        LocalStorageMemory.storage.splice(0, LocalStorageMemory.storage.length)
    }

    removeItem(keyName: string) {
        const indexItemByKeyName = this.getIndexItemByKeyName(keyName)

        if (indexItemByKeyName < 0) {
            return
        }

        LocalStorageMemory.storage.splice(indexItemByKeyName, 1)
    }

    key(indexItem: number) {
        const itemByIndex = this.getItemByKeyIndex(indexItem)

        return itemByIndex
    }

    private addItem(key: string, value: any) {
        LocalStorageMemory.storage.push({ key, value })
    }

    private getItemByKeyName(keyName: string) {
        const itemByKeyName = LocalStorageMemory.storage.find(item => item.key == keyName)?.value || null

        return itemByKeyName
    }

    private getItemByKeyIndex(indexItem: number) {
        const itemByIndex = LocalStorageMemory.storage[indexItem]?.value || null

        return itemByIndex
    }

    private getIndexItemByKeyName(keyName: string) {
        const itemByKeyName = LocalStorageMemory.storage.findIndex(item => item.key == keyName)

        return itemByKeyName
    }
}
