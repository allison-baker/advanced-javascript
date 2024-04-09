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

// Walk a tree
/* Depth first (DF) - stack
    pre-order - parent before the children
    in-order - parent in between the children
    post-order - parent after the children
*/
/* Breadth first (BF)
    level-order - level by level
*/

// let root = {
//     value: 'P',
//     children: [
//         {
//             value: 'F',
//             children: [{
//                 value: 'C',
//                 children: [{
//                     value: 'E',
//                     children: []
//                 }],
//             }],
//         },
//         {
//             value: 'R',
//             children: []
//         }
//     ]
// }

// // TODO: Use preorder for printing out results for fatcats assignment
// function preOrder(curr) {
//     if (!curr) return

//     const { value, children } = curr
//     console.log(value)
//     for (let child of children) {
//         console.group()
//         preOrder(child)
//         console.groupEnd()
//     }
// }

// function inOrder(curr) {
//     if (!curr) return

//     const { value, left, right } = curr
//     inOrder(left)
//     console.log(value)
//     inOrder(right)
// }

// function levelOrder(curr) {
//     const q = [curr]

//     while (q.length) {
//         curr = q.shift()
//         if (curr === null) continue

//         console.log(curr.value)
//         q.push(curr.left)
//         q.push(curr.right)
//     }
// }

// // TODO: Use post-order for calculating directory sizes in fatcats assignment
// function postOrder(curr) {
//     if (!curr) return

//     const { value, children } = curr
//     for (let child of children) {
//         console.group()
//         postOrder(child)
//         console.groupEnd()
//     }
//     console.log(value)
// }

// function main() {
//     console.log('\nPre-order: ')
//     preOrder(root)

//     // console.log('\nIn-order: ')
//     // inOrder(root)

//     console.log('\nPost-order: ')
//     postOrder(root)

//     // console.log('\nLevel-order: ')
//     // levelOrder(root)
// }

// main()

