export function deepClone<T = any>(obj: T, hash = new WeakMap()): T {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj) as T
    }

    if (isClass(obj)) {
        return obj
    }

    if (hash.has(obj as any)) {
        return hash.get(obj as any)
    }

    const isArray = Array.isArray(obj)
    const clone: T = (isArray ? [] : {}) as T

    hash.set(obj as any, clone)

    if (isArray) {
        obj.forEach((item, index) => {
            // @ts-expect-error
            clone[index] = deepClone(item, hash)
        })
    } else {
        Object.keys(obj).forEach(key => {
            // @ts-expect-error
            clone[key] = deepClone(obj[key], hash)
        })
    }

    return clone
}

function isClass(object: any) {
    return Object.getPrototypeOf(object) !== Object.prototype
}