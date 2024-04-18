const bcrypt = require('bcryptjs')
const fs = require('fs')
const mcupws = require('../scrape/mcupws.json')
const ProgressBar = require('progress')

const hashes = fs.readFileSync('test.hashes', 'utf8').split(/\r?\n/)
const bar = new ProgressBar(':bar', { total: 9984})

for (let pw of mcupws) {
    for (let hash of hashes) {
        if (bcrypt.compareSync(pw, hash)) {
            console.log('Match:', pw, hash)
            fs.appendFileSync('hash.answers.txt', `${pw} ${hash}\n`)
        }
    }
    bar.tick()
}

console.log('\nComplete')