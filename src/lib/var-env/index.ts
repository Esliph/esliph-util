import 'dotenv/config'

export type GetEnvArgs<DefaultType> = { name: string, defaultValue?: DefaultType, forceDefaultValue?: boolean, defaultValueInProduction?: boolean }

export function getEnv<DefaultType>({ name, defaultValue, forceDefaultValue = false, defaultValueInProduction = false }: GetEnvArgs<DefaultType>) {
    if (process.env['ENVIRONMENT'] == 'PRODUCTION') {
        if (!defaultValueInProduction) {
            return process.env[`${name}`] || ''
        }
    }

    if (!forceDefaultValue) {
        return process.env[`${name}`] || defaultValue || ''
    }

    return defaultValue || process.env[`${name}`] || ''
}