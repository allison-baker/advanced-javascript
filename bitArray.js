const bitMask = [
    0b00000001,
    0b00000010,
    0b00000100,
    0b00001000,
    0b00010000,
    0b00100000,
    0b01000000,
    0b10000000
]

// FIXME:
function bitArray(bitSize) {
    const byteSize = Math.ceil(bitSize / 8);
    const bytes = new Uint8Array(byteSize)

    return {
        // TODO: write 1 to ith bit in bytes
        set: i => bytes[Math.floor(i / 8)] |= bitMask[i % 8],

        // TODO: write 0 to ith bit in bytes
        clear: i => bytes[Math.floor(i / 8)] &= ~bitMask[i % 8],

        // TODO: read 0 or 1 from ith bit in bytes
        get: i => (bytes[Math.floor(i / 8)] & bitMask[i % 8]) ? 1 : 0,

        // TODO: write 1 to ith bit in bytes if it's 0, and vice versa (aka toggle)
        flip: i => bytes[Math.floor(i / 8)] ^= bitMask[i % 8]
    }
    // NOTE do set, clear, get, and flip in one line
    // NOTE use bitmask above and not bit shifting
}

// FIXME:
function test() {
    // Make a bit array for 73 bits
    const bits = bitArray(73)

    // Put in a console.assert each of these:

    // Do nothing, an untouched bit should be 0
    console.assert(bits.get(0) === 0, 'Get 0 failed')

    // Set a 0 bit, it should be 1
    console.assert(bits.set(0) === 1, 'Set 0 failed')

    // Set a 1 bit, it should be 1
    bits.set(1)
    console.assert(bits.get(1) === 1, 'Set 1 failed')

    // Clear a 0 bit, it should be 0
    bits.clear(0)
    console.assert(bits.get(0) === 0, 'Clear 0 failed')

    // Clear a 1 bit, it should be 0
    bits.set(1)
    bits.clear(1)
    console.assert(bits.get(1) === 0, 'Clear 1 failed')

    // Flip a 0 bit, it should be 1
    bits.clear(0)
    bits.flip(0)
    console.assert(bits.get(0) === 1, 'Flip 0 failed')

    // Flip a 1 bit, it should be 0
    bits.set(1)
    bits.flip(1)
    console.assert(bits.get(1) === 0, 'Flip 1 failed')
}

test()
