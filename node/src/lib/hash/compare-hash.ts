import bcryptjs from 'bcryptjs'

export async function compareHashWithRef(hash: string, ref: string) {
    const isEqual = await bcryptjs.compare(`${ref}`, `${hash}`)

    return isEqual
}
