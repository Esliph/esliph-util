import bcryptjs from 'bcryptjs'

export const hash = {
    generate: generateHash,
    compare: compareHash
}

async function generateHash(text: string) {
    const testHash = await bcryptjs.hash(`${text}`, 5).then(res => { return res })

    return testHash
}

async function compareHash(hash: string, ref: string) {
    const isEqual = await bcryptjs.compare(`${ref}`, `${hash}`)

    return isEqual
}