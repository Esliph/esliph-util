import bcryptjs from 'bcryptjs'

export async function generateHash(text: string) {
    const hashGenerated = await bcryptjs.hash(`${text}`, 5).then(res => res)

    return hashGenerated
}
