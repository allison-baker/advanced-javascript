// const bcrypt = require('bcryptjs')
// const {nth} = require('lodash')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function* pwsOfLength1() {
    for (let char of alphabet) {
        yield char
    }
}
function* pwsOfLength2() {
    for (let char1 of alphabet) {
        for (let char2 of pwsOfLength1()) {
            yield `${char1}${char2}`
        }
    }
}
function* pwsOfLength3() {
    for (let char1 of alphabet) {
        for (let char2 of pwsOfLength2()) {
            yield `${char1}${char2}`
        }
    }
}

function* pwsUpToLength3() {
    yield* pwsOfLength1()
    yield* pwsOfLength2()
    yield* pwsOfLength3()
}

function main() {
    for (let pw of pwsUpToLength3()) {
        console.log(pw)
    }
}

main()

// for (let i=0; i<25; i++) {
//     const hash = bcrypt.hashSync('bacon', 4)
//     console.log(hash)
// }

// const hash = bcrypt.hashSync('bacon', 8)

// console.log(bcrypt.compareSync('bacon', hash)) // true
// console.log(bcrypt.compareSync('veggies', hash)) // false