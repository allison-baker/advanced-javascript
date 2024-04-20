const fs = require('fs')
const bcrypt = require('bcryptjs')
// const _ = require('lodash')
const mcupws = require('./mcupws.json')
const ProgressBar = require('progress')

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function* pwsOfLenN(n) {
    if (n === 1) {
        yield* alphabet
        return
    }
    for (let char1 of alphabet) {
        for (let char2 of pwsOfLenN(n - 1)) {
            yield `${char1}${char2}`
        }

    }
}

function* allClearTextPws() {   // length 252,219
    yield ''
    yield* mcupws.slice(0, 100)
    yield* pwsOfLenN(1)
    yield* mcupws.slice(100, 1000)
    yield* pwsOfLenN(2)
    yield* mcupws.slice(1000)
    yield* pwsOfLenN(3)
}

function main() {
    const allHashes = fs.readFileSync('./hashes.txt', 'utf8').split(/\r?\n/)
    const hashes = allHashes.slice(allHashes.length - 50_000)

    const bar = new ProgressBar('Progress [:bar] :percent :elapsed :etas', { total: hashes.length })
    console.time('Cracking Hashes')
    // const cracked = []

    for (let hash of hashes) {
        for (let pw of allClearTextPws()) {
            if (bcrypt.compareSync(pw, hash)) {
                fs.appendFileSync('hashes.answers.txt', `${hash} ${pw === '' ? "''" : pw}\n`)
                bar.tick()
                break
            }
        }
    }

    // fs.writeFileSync('hashes.answers.txt', hashes.join('\n'))
    console.log('\nComplete')
    console.timeEnd('Cracking Hashes')
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
//     for (let i = 1; i <= n; i++) {
//         yield* pwsOfLenN(i)
//     }
// }

// for (let pw of allClearTextPws()) {
//     for (let hash of hashes) {
//         if (bcrypt.compareSync(pw, hash)) {
//             cracked.push(`${hash} ${pw === '' ? "''" : pw}`)
//             bar.tick()
//             break
//         }
//     }
//     if (bar.complete) {
//         break
//     }
// }
