const fs = require('fs')
const bcrypt = require('bcryptjs')
const mcupws = require('./mcupws.json')
const ProgressBar = require('progress')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function* pwsOfLenN(n) {
    if (n === 1) {
        yield* alphabet
        return
    }
    for (let char1 of alphabet) {
        for (let char2 of pwsOfLenN(n-1)) {
            yield `${char1}${char2}`
        }
    
    }
}

function* allClearTextPws() {
    yield ''
    yield* mcupws.slice(0, 100)
    yield* pwsOfLenN(1)
    yield* mcupws.slice(100, 900)
    yield* pwsOfLenN(2)
    yield* mcupws.slice(900)
    yield* pwsOfLenN(3)
}

function main() {
    const allHashes = fs.readFileSync('./hashes.txt', 'utf8').split(/\r?\n/)
    const hashes = allHashes.slice(allHashes.length - 50_000)
    const bar = new ProgressBar(':bar', { total: hashes.length })

    for (let pw of allClearTextPws()) {
        for (let hash of hashes) {
            if (bcrypt.compareSync(pw, hash)) {
                fs.appendFileSync('hashes.answers.txt', `${hash} ${pw === '' ? "''" : pw}\n`)
                bar.tick()
                break
            }
        }
        if (bar.complete) {
            break
        }
    }
    console.log('\nComplete')
}

main()

/*********************** ELEPHANT CODE GRAVEYARD ***********************/

// for (let i=0; i<25; i++) {
//     const hash = bcrypt.hashSync('bacon', 4)
//     console.log(hash)
// }

// const hash = bcrypt.hashSync('bacon', 8)

// console.log(bcrypt.compareSync('bacon', hash)) // true
// console.log(bcrypt.compareSync('veggies', hash)) // false

// function* pwsOfLength1() {
//     for (let char of alphabet) {
//         yield char
//     }
// }
// function* pwsOfLength2() {
//     for (let char1 of alphabet) {
//         for (let char2 of pwsOfLength1()) {
//             yield `${char1}${char2}`
//         }
//     }
// }
// function* pwsOfLength3() {
//     for (let char1 of alphabet) {
//         for (let char2 of pwsOfLength2()) {
//             yield `${char1}${char2}`
//         }
//     }
// }

// function* pwsUpToLength3() {
//     yield* pwsOfLength1()
//     yield* pwsOfLength2()
//     yield* pwsOfLength3()
// }

// function* pwsUpToLengthN(n) {
//     for (let i=1; i<=n; i++) {
//         yield* pwsOfLenN(i)
//     }
// }
