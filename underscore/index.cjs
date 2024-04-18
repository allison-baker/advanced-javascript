const _ = require('lodash')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const mcupws = require('../scrape/mcupws.json')

const pws =  [
    _.sample(mcupws), // 'password'
    _.sample('ABCDEF'), // 'B'
    _.sampleSize('ABCDEF', 2).join(''), // 'AE'
]

pws = _.shuffle(pws)

const content = pws.map((pw) => bcrypt.hashSync(pw, 4)).join('\n')

fs.writeFileSync('test.hashes', content)
