export function deepMerge(target: any, ...sources: any[]) {
    for (const source of sources) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = Array.isArray(source[key]) ? [] : {}
                    }
                    if (source[key] instanceof Date) {
                        target[key] = new Date(source[key])
                    } else {
                        deepMerge(target[key], source[key])
                    }
                } else {
                    target[key] = source[key]
                }
            }
        }
    }
    return target
}
