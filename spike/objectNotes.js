// ARRAY AND ARRAY-LIKE OBJECTS
/* Array-like object - an object with a length property and indexed elements
    - string
    - arguments
    - HTMLElements
    - NodeList
*/

const arrayLike = {
    0: "Jane",
    1: "Fred",
    length: 2,
    name: "Johnson"
}

// ITERATOR AND ITERABLE
/* Iterator - any object that has a next key to a function that returns an object with value and done
   Iterable - anything that will give you an iterator object
*/

const iterator = {
    randNums: [14, 2, 5, 9],
    next: function () {
        const randNum = randNums.pop()
        if (randNum) return {
            value: randNum,
            done: false
        }
        return { done: true }
    }
}

// GENERATOR
/* Generator - a special function marked with an asterisk that returns an iterator, uses the keyword yield instead of return */

function* simpleGenerator() {
    yield 5
}
function* genTen() {
    for (let i = 0; i < 10; i++) {
        yield i
    }
}

// ITERATING WITH FOR-OF
/* For-of works on iterables
   Built-in iterables:
    - Array
    - String
    - arguments
    - generator functions
    - Map
    - Set
   To turn an array-like object into an iterables:
    - Array.from(foo)
    - [...foo]
    - Object.keys(foo)
    - Object.values(foo)
    - Object.entries(foo)
*/

// This function is short hand for...
for (let char of string) {
    console.log(char)
}

// ...using an iterator like this
let iter = str[Symbol.iterator]()
while(true) {
    let result = iter.next()
    if (result.done) break;
    let char = result.value
    console.log(char)
}
