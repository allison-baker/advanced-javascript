const fs = require('fs')

function usage() {
    let helpTxt = fs.readFileSync('../fatcats/help.txt', 'utf-8')
    console.log(helpTxt)
}

function main() {
    const args = process.argv.slice(2)
    if (args.filter(arg => arg === '-h' || arg === '--help')) {
        usage()
    }
}

main()