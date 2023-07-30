import { ResultException } from './../lib/exception/index';

const error = new ResultException({
    message: 'Error example'
})

// console.log(error)

// console.log("-------------------------")
// console.log(error.getError())
// console.log(error.getDescription())
// console.log(error.getMessage())
// console.log(error.getStack())
// console.log(error.getStatus())
// console.log(error.getTitle())
// console.log("-------------------------")

try {
    throw error
} catch (e: any) {
    if (e instanceof Error) {
        console.log(e)
    }

    console.log("-----------")

    throw e
}