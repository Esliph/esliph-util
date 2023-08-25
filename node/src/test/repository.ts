import { Document, ModelPayloadArgs, ModelSchema, SelectArgs } from './../lib/repository-memory'

type User = {
    username: string
    email: string
    age: number
    zipCode?: string
    active: boolean
    hobbies: string[]
}

class UserRepository extends ModelSchema<User> {
    constructor() {
        super('User')
    }
}

const userRepository = new UserRepository()

userRepository.createMany({
    data: [
        { username: 'Aan-ruan', email: 'dan@gmail.com', age: 19, active: false, hobbies: ['Coding'] },
        { username: 'Ban-ruan', email: 'dan@gmail.com', age: 19, active: false, hobbies: ['Coding'] },
        { username: 'dan-ruan', email: 'dan@gmail.com', age: 20, active: true, hobbies: [], zipCode: '100.200.400-45' },
        { username: 'dan-ruan', email: 'dan@gmail.com', age: 30, active: false, hobbies: [] },
    ],
})

console.log(
    userRepository.findMany({
        where: {
            AND: [{ OR: [{ hobbies: { isEmpty: false } }, { active: true }] }, { age: { lessThat: 25 } }],
        },
        orderBy: [{ age: 'DESC' }, { username: 'DESC' }],
    })
)
