let nums = [1, 7, 9, 8, 3, 2, 10, -5]
let strs = ['gamma', 'alpha', 'Alpha', 'Beta', 'beta', 'Gamma', 'ALPHA']

/*********************** SORT COMPARATOR UTILS ***********************/

const noCompare = (a, b) => 0
const shuffle = (a, b) => Math.random() - 0.5

// DESCENDING
const compareNumsDesc = (a, b) => b - a
const compareStrsDesc = (a, b) => a.localeCompare(b)

// DESCENDING
const compareNumsAsc = (a, b) => a - b
const compareStrsAsc = (a, b) => b.localeCompare(a)

/*********************** OBJECT SORTING ***********************/

// DOG BY NAME
const compareByName = (a, b) => {
    const aName = a.name
    const bName = b.name
    return compareStrsDesc(aName, bName)
}

// DOG BY AGE
const compareByAge = (a, b) => {
    const aAge = Number(a.age)
    const bAge = Number(b.age)
    return compareNumsDesc(aAge, bAge)
}

console.log(nums.sort(compareNumsDesc))
console.log(strs.sort(compareStrsDesc))

console.log(nums.sort(compareNumsAsc))
console.log(strs.sort(compareStrsAsc))

// console.table(dogs.sort(compareByName))
// console.table(dogs.sort(compareByAge))