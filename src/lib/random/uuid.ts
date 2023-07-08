import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, V1Options, V4Options } from 'uuid'

export function randomIduuidV1(argsOptions: V1Options) {
    return uuidv1(argsOptions)
}

export function randomIduuidV4(argsOptions: V4Options) {
    return uuidv4(argsOptions)
}
