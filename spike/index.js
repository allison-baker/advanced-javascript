const fs = require('fs')

const file = (name, size) => ({ name, size })
const dir = (name, size, children) => ({ name, size, children })

// Post order - get sizes from children and sum for parent
function buildTree(curr, path) {
    const children = fs.readdirSync(path)

    for (let child of children) {
        const relPath = `${path}/${child}`
        const stats = fs.statSync(relPath)
        if (stats.isDirectory()) {
            const newDir = buildTree(
                {
                    name: child,
                    size: 0,
                    children: []
                },
                relPath
            )
            curr.children.push(newDir)
            curr.size += newDir.size
        } else if (stats.isFile()) {
            const newFile = file(child, stats.size)
            curr.children.push(newFile)
            curr.size += newFile.size
        }
    }

    return curr
}

function main() {
    const root = dir('fatcats', 0, [])
    const tree = buildTree(root, '../fatcats')
    console.log(JSON.stringify(tree, null, 2))
}

main()

/* ELEPHANT CODE GRAVEYARD */
// let node = {
//     name: '.',
//     size: 0,
//     children: [
//         {
//             name: 'foo',
//             size: 2048,
//         },
//         {
//             name: 'bar',
//             size: 395791,
//         },
//     ],
// }

// // Pre order - print the parent and then the children
// function printTree(curr) {
//     console.log('printTree', curr)
// }
