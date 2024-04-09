function clamp(min, max) {
    return function(x) {
        if (x < min) return min
        if (x > max) return max
        return x
    }
}

function clamp2(x) {
    const MIN = 1
    const MAX = 10_000
    if (x < MIN) return MIN
    if (x > MAX) return MAX
    return x
}

function main() {
    const qualityClamp = clamp(1, 10_000)
    const yahtzee = clamp(1, 6)
    console.assert(qualityClamp(11) === 11, '11 failed')
    console.assert(qualityClamp(13) === 13, '13 failed')
    console.assert(qualityClamp(-8) === 1, '-8 failed')
    console.assert(qualityClamp(1) === 1, '1 failed')
    console.assert(qualityClamp(10_000) === 10_000, '10_000 failed')
    console.assert(qualityClamp(10_100) === 10_000, '10_100 failed')
    console.assert(qualityClamp(7_030) === 7_030, '7_030 failed')

    console.assert(yahtzee(1) === 1, '1 failed')
    console.assert(yahtzee(7) === 6, '7 failed')
    console.assert(yahtzee(6) === 6, '6 failed')
    console.assert(yahtzee(5) === 5, '5 failed')
    console.assert(yahtzee(0) === 1, '0 failed')
    console.assert(yahtzee(2) === 2, '2 failed')
    console.assert(yahtzee(3) === 3, '3 failed')
}

main()