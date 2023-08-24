import { ModelSchema } from './../lib/repository-memory'

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
        { username: 'dan-ruan', email: 'dan@gmail.com', age: 19, active: true, hobbies: [] },
        { username: 'dan-ruan', email: 'dan@gmail.com', age: 19, active: true, hobbies: [], zipCode: '100.200.400-45' },
        { username: 'dan-ruan', email: 'dan@gmail.com', age: 19, active: true, hobbies: [] }
    ]
})

console.log(userRepository.findMany({ where: { zipCode: { filled: false } } }))