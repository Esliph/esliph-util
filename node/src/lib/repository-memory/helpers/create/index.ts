import { Types } from '..'
import { deepClone, deepMerge } from '../../util'

export function createDocument<M extends Types.DocumentDefaultArgs>(args: Types.CreateArgs<M>, id: number) {
    const dateOfCreation = new Date(Date.now())

    return deepClone(
        deepMerge({}, args.data, {
            id,
            createAt: dateOfCreation,
            updateAt: dateOfCreation,
        }) as Types.Document<M>
    )
}
