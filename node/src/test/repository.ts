import { Document, ModelPayloadArgs, ModelSchema, SelectArgs, ModelSchemaOptions } from './../lib/repository-memory'

type User = {
    username: string
    email: string
    age: number
    zipCode?: string
    active: boolean
    hobbies: string[]
}

class UserRepository extends ModelSchema<User> {
    constructor(options?: ModelSchemaOptions) {
        super('User', options)
    }
}

const userRepository = new UserRepository()
const userRepository2 = new UserRepository({ isolated: true })

userRepository.createMany({
    data: [
        { username: 'Aan-ruan', email: 'dan@gmail.com', age: 19, active: false, hobbies: ['Coding'] },
    ],
})

userRepository2.createMany({
    data: [
        { username: 'Aan-ruan', email: 'dan@gmail.com', age: 19, active: false, hobbies: ['Coding'] },
    ]
})

console.log(
    userRepository.findMany()
)
