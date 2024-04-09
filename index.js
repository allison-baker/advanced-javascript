// Walk a tree
/* Depth first (DF) - stack
    pre-order - parent before the children
    in-order - parent in between the children
    post-order - parent after the children
*/
/* Breadth first (BF)
    level-order - level by level
*/

let root = {
    value: 'P',
    children: [
        {
            value: 'F',
            children: [{
                value: 'C',
                children: [{
                    value: 'E',
                    children: []
                }],
            }],
        },
        {
            value: 'R',
            children: []
        }
    ]
}

// TODO: Use preorder for printing out results for fatcats assignment
function preOrder(curr) {
    if (!curr) return

    const { value, children } = curr
    console.log(value)
    for (let child of children) {
        console.group()
        preOrder(child)
        console.groupEnd()
    }
}

// TODO: Use post-order for calculating directory sizes in fatcats assignment
function postOrder(curr) {
    if (!curr) return

    const { value, children } = curr
    for (let child of children) {
        console.group()
        postOrder(child)
        console.groupEnd()
    }
    console.log(value)
}

function main() {
    console.log('\nPre-order: ')
    preOrder(root)

    // console.log('\nIn-order: ')
    // inOrder(root)

    console.log('\nPost-order: ')
    postOrder(root)

    // console.log('\nLevel-order: ')
    // levelOrder(root)
}

main()

// ELEPHANT CODE GRAVEYARD

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