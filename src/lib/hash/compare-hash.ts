import bcryptjs from 'bcryptjs'

export async function compareHash(hash: string, ref: string) {
    const isEqual = await bcryptjs.compare(`${ref}`, `${hash}`)

    return isEqual
}
