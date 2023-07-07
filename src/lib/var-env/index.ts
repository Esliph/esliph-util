import 'dotenv/config'

export function getEnv<T>({
    name,
    default: defaultValue,
    forceDefault = false,
    production = false,
}: {
    name: string
    default?: T
    forceDefault?: boolean
    production?: boolean
}) {
    if (process.env['ENVIRONMENT'] == 'PRODUCTION') {
        return !production
            ? process.env[`${name}`] || ''
            : !forceDefault
            ? process.env[`${name}`] || defaultValue || ''
            : defaultValue || process.env[`${name}`] || ''
    }

    return !forceDefault ? process.env[`${name}`] || defaultValue || '' : defaultValue || process.env[`${name}`] || ''
}
