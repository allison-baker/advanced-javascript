'use tscheck'
const chalk = require('chalk')
const fsPromises = require('fs').promises
const path = require('path')

/* HELPER FUNCTIONS */
const metricSize = (size) => {
  if (size < 1_000) return `(${size} bytes)`
  if (size < 1_000_000) {
    let kb = size / 1_000
    return `(${kb.toFixed(1)} KB)`
  }
  if (size < 1_000_000_000) {
    let mb = size / 1_000_000
    return `(${mb.toFixed(1)} MB)`
  }
  let gb = size / 1_000_000_000
  return `(${gb.toFixed(1)} GB)`
}

const plainSize = (size) => `(${size.toLocaleString()})`

const compareSize = (a, b) => b.size - a.size

const compareName = (a, b) => {
  aName = a.name
  bName = b.name
  return aName.localeCompare(bName)
}

const compareExten = (a, b) => {
  let aExten, bExten

  if (a.children) aExten = ''
  else aExten = path.extname(a.name)

  if (b.children) bExten = ''
  else bExten = path.extname(b.name)

  return bExten.localeCompare(aExten)
}

const noCompare = (a, b) => 0

const symbols = ['|', '/', '-', '\\']
let count = 0
function tick() { process.stdout.write('\b' + symbols[count++ % 4]) }

/* GLOBAL FLAGS */
let startPath = path.resolve()
let sortOrder = noCompare
let metricFormat = plainSize
let threshold = 0

let lang = 'en'
let loc = 'US'

let helpFile = `help.en_US.txt`
let messagesFile = `messages.en_US.json`
let msg = require(`./${messagesFile}`)
let pwd = path.resolve()

async function usage() {
  try {
    const text = await fsPromises.readFile(helpFile, 'utf-8')
    console.log(text)
    process.exit()
  } catch (error) {
    console.log(chalk.red(msg['help file error']), error.message)
    process.exit()
  }

}

async function setFlags() {
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-lang':
      case '--language':
        if (!args[i + 1] || args[i + 1].charAt(0) === '-') {
          console.log(chalk.red(msg['language parameter error']))
          await usage()
          process.exit()
        }
        lang = args[i + 1]

        i++
        break

      case '-loc':
      case '--locale':
        if (!args[i + 1] || args[i + 1].charAt(0) === '-') {
          console.log(chalk.red(msg['locale parameter error']))
          await usage()
          process.exit()
        }
        loc = args[i + 1]
        i++
        break
    }
  }

  helpFile = `help.${lang}_${loc}.txt`
  messagesFile = `messages.${lang}_${loc}.json`
  msg = require(`./${messagesFile}`)

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-h':
      case '--help':
        await usage()
        break

      case '-p':
      case '--path':
        if (!args[i + 1] || args[i + 1].charAt(0) === '-') {
          console.log(chalk.red(msg['path parameter error']))
          await usage()
          process.exit()
        }
        startPath = path.resolve(pwd, args[i + 1])
        i++
        break

      case '-s':
      case '--sort':
        if (!args[i + 1] || args[i + 1].charAt(0) === '-') {
          console.log(chalk.red(msg['sort parameter error']))
          await usage()
          process.exit()
        }
        if (args[i + 1] === 'alpha') sortOrder = compareName
        else if (args[i + 1] === 'exten') sortOrder = compareExten
        else if (args[i + 1] === 'size') sortOrder = compareSize
        else {
          console.log(chalk.red(msg['one of three sort parameter error']))
          await usage()
          process.exit()
        }
        i++
        break

      case '-m':
      case '--metric':
        metricFormat = metricSize
        break

      case '-t':
      case '--threshold':
        if (!args[i + 1] || args[i + 1].charAt(0) === '-') {
          console.log(chalk.red(msg['threshold parameter error']))
          await usage()
          process.exit()
        }
        threshold = args[i + 1]
        i++
        break

      case '-lang':
      case '--language':
      case '-loc':
      case '--locale':
        i++
        break

      default:
        console.log(chalk.red(msg['nonexistent flag error']))
        await usage()
        process.exit()
    }
  }
}

const file = (name, size) => ({ name, size })
const dir = (name, size, children) => ({ name, size, children })

async function buildTree(curr, path) {
  try {
    const children = await fsPromises.readdir(path)

    for (let child of children) {
      const relPath = `${path}/${child}`
      const stats = await fsPromises.stat(relPath)
      if (stats.isDirectory()) {
        const newDir = await buildTree(
          {
            name: relPath,
            size: 0,
            children: []
          },
          relPath
        )
        curr.children.push(newDir)
        curr.size += newDir.size
      } else if (stats.isFile()) {
        const newFile = file(relPath, stats.size)
        curr.children.push(newFile)
        curr.size += newFile.size
      }

      curr.children.sort(sortOrder)
    }
  } catch (error) {
    console.log(chalk.red(msg['failed to build tree'], error.message))
    await usage()
    process.exit()
  }

  return curr
}

function printTree(tree) {
  const { name, size, children } = tree
  if (size < threshold) return

  if (!children) {
    console.log(chalk.magenta(`${name} `, metricFormat(size)))
    return
  }

  console.log(chalk.cyan(`${name} `, metricFormat(size)))
  for (let child of children) {
    printTree(child)
  }
}

function main() {
  setFlags()

  const spinnerID = setInterval(tick, 300)
  setTimeout(async () => {
    clearInterval(spinnerID)
    console.log('\n')
    try {
      const root = dir(startPath, 0, [])
      const tree = await buildTree(root, startPath)
      printTree(tree)
    } catch (error) {
      console.log(chalk.red(msg['main error'], error.message))
      await usage()
      process.exit()
    }
  }, 3000)
}

main()

// ELEPHANT CODE GRAVEYARD
/* You can put any comment code here. It'll be ignored by the grader. */

/* HARDCODE TEST TREES (for v0.2) */

// // empty dir
// let tree = dir('.', 0, [])

// // dir w/ 2 files and no subdirs
// let tree2 = {
//   name: '.', size: 0, children: [
//     { name: 'readme.txt', size: 731 },
//     { name: 'fillup.exe', size: 49333 }
//   ]
// }

// // dir w/ 2 files and 2 subdirs (1 empty dir and 1 dir of 1 empty file)
// let tree3 = dir('.', 0, [
//   dir('foo', 0, []),
//   file('bar', 27),
//   file('baz', 1800831),
//   dir('foobar', 0, [
//     file('quux', 0)
//   ])
// ])

// /* BUILD UP A VARIETY OF TREES OF VARIOUS WIDTHS AND DEPTHS TO TEST WITH */

// // dir with 1 file and 1 subdir w/ file
// let tree4 = dir('.', 0, [
//   dir('bar', 0, [
//     file('wow.exe', 2811721329),
//   ]),
//   file('source.txt', 1),
// ])

// // very wide directory
// let tree5 = dir('.', 0, [
//   file('foo', 5),
//   file('bar', 10),
//   file('baz', 16),
//   file('foobar', 18725),
//   file('fizz', 128576839),
//   dir('buzz', 0, []),
//   dir('fizzbuzz', 0, [
//     file('foobuzz', 2874),
//   ]),
//   file('faz', 3962),
//   dir('fazbear', 0, [
//     file('freddy', 298546),
//     file('biz', 28),
//   ]),
//   dir('buzzfizz', 0, []),
// ])

// // very deep directory
// let tree6 = dir('.', 0, [
//   dir('foo', 0, [
//     dir('bar', 0, [
//       dir('foobar', 0, [
//         dir('fizz', 0, [
//           dir('buzz', 0, [
//             dir('fizzbuzz', 0, [
//               file('faz', 18846),
//               file('bear', 2985),
//               file('fazbear', 28972599),
//             ]),
//           ]),
//         ]),
//       ]),
//     ]),
//   ]),
// ])

// // very deep and wide directory
// let tree7 = dir('.', 0, [
//   dir('foo', 0, [
//     dir('bar', 0, [
//       dir('foobar', 0, [
//         dir('fizz', 0, [
//           dir('buzz', 0, [
//             file('fizzbuzz', 12938),
//             file('foobear', 983897),
//             file('fizzbar', 937),
//             dir('foobuzz', 0, [
//               file('fizzbizz', 28),
//               dir('barbuzz', 0, [])
//             ]),
//           ]),
//           file('bizbiz', 20975),
//           file('buzzbuzz', 34),
//         ]),
//         dir('buzzfoo', 0, [
//           file('buzzbear', 93),
//           dir('faz', 0, [
//             file('freddy', 89328),
//             file('fazbear', 2387),
//           ]),
//         ]),
//       ]),
//       file('buzzbizz', 2039),
//       file('zzibzzif', 389),
//       dir('buzzfizz', 0, [
//         file('fazbaz', 389),
//         file('bazbiz', 0),
//         dir('another one', 0, [])
//       ])
//     ]),
//     file('please', 9),
//     file('appreciate', 238),
//     dir('my', 0, [
//       file('dedication', 8),
//       file('to', 9),
//       dir('hardcoding', 0, [
//         file('trees', 87234)
//       ])
//     ])
//   ]),
//   file('random', 83478),
//   file('last one', 98),
// ])

// // OUTPUT
// printTree(tree)
// printTree(tree2)
// printTree(tree3)
// printTree(tree4)
// printTree(tree5)
// printTree(tree6)
// printTree(tree7)

/* DEPRECATED PIECES FROM V0.7 */

// 'use strict'
// const fs = require('fs')

// let blocksize = 1

/* BUILD TREES WITH RELATIVE PATHS */
// function buildTree(curr, path) {
//   const children = fs.readdirSync(path)

//   for (let child of children) {
//     const relPath = `${path}/${child}`
//     const stats = fs.statSync(relPath)
//     if (stats.isDirectory()) {
//       const newDir = buildTree(
//         {
//           name: child,
//           size: 0,
//           children: []
//         },
//         relPath
//       )
//       curr.children.push(newDir)
//       curr.size += newDir.size
//     } else if (stats.isFile()) {
//       const newFile = file(child, stats.size)
//       curr.children.push(newFile)
//       curr.size += newFile.size
//     }
//   }

//   return curr
// }

/* PRINT METRIC WITH BLOCK SIZE */
// const metricSize = (size) => {
//   let rounded = Math.ceil(size / blocksize) * blocksize
//   if (rounded < 1_000) return `(${rounded} bytes)`
//   if (rounded < 1_000_000) {
//     let kb = rounded / 1_000
//     return `(${kb.toFixed(1)} KB)`
//   }
//   if (rounded < 1_000_000_000) {
//     let mb = rounded / 1_000_000
//     return `(${mb.toFixed(1)} MB)`
//   }
//   let gb = rounded / 1_000_000_000
//   return `(${gb.toFixed(1)} GB)`
// }

/* DEPRECATED FOR V1.0 */
// case '-b':
// case '--blocksize':
//   blocksize = 4096
//   break

/* PLAIN SIZE WITH BLOCK SIZE */
// const plainSize = (size) => `(${(Math.ceil(size / blocksize) * blocksize).toLocaleString()})`

/* PRINTING TREE WITH TRAILING / FOR DIRECTORIES AND INDENTATION */
// function printTree(tree) {
//   const { name, size, children } = tree
//   if (size < threshold) return

//   if (children) console.log(`${name}/ `, metricFormat(size))
//   else console.log(`${name} `, metricFormat(size))

//   if (!children) return
//   children.sort(sortOrder)
//   for (let child of children) {
//     console.group()
//     printTree(child)
//     console.groupEnd()
//   }
// }