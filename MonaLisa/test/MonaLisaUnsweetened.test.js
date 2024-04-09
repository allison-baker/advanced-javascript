const { Shop, Item, Brie, Conjured, passes, sulfuras } = require('../src/MonaLisaUnsweetened')
const CONJURED = 'Conjured'

/* SULFURAS */

describe('Sulfuras', function () {
  // Check that Sulfuras quality never degrades, even after expiration
  it('Always quality 80', function () {
    const sulfurasShop = new Shop([sulfuras])
    const items = sulfurasShop.updateShop()
    expect(items[0].quality).toBe(80)
  })
})

/* BACKSTAGE PASSES */

describe('BackstagePasses', function () {
  // Check that Backstage passes are set to 0 when expired
  it('0 after expiry', function () {
    const pass = passes(0, 100)
    const backstage = new Shop([pass])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(0)
  })

  // Check that Backstage passes increase by 2 when 10 days or less from sellIn
  it('+2 less than 10 days from sellIn', function () {
    const pass = passes(9, 10)
    const backstage = new Shop([pass])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(12)
  })

  // Check that Backstage passes increase by 3 when 5 days or less from sellIn
  it('+3 less than 5 days from sellIn', function () {
    const pass = passes(4, 10)
    const backstage = new Shop([pass])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(13)
  })
})

/* AGED BRIE */

describe('AgedBrie', function () {
  // Check that Aged Brie never goes over 50 in quality
  it('Quality under 50', function () {
    const brie = new Brie(1, 50)
    const agedBrie = new Shop([brie])
    const items = agedBrie.updateShop()
    expect(items[0].quality).toBe(50)
  })

  // Check that Aged Brie increases x2 in quality after expiry
  it('Increase after expiry', function () {
    const brie = new Brie(-1, 10)
    const agedBrie = new Shop([brie])
    const items = agedBrie.updateShop()
    expect(items[0].quality).toBe(12)
  })
})

/* NORMAL ITEMS */

describe('Normal', function () {
  // Check that normal items degrade twice as fast once expired
  it('x2 after sellIn', function () {
    const normal = new Shop([new Item('normal item', -1, 10)])
    const items = normal.updateShop()
    expect(items[0].quality).toBe(8)
  })

  // Check that the quality of an item is never negative
  it('Quality never negative', function () {
    const normal = new Shop([new Item('normal item', 1, 0)])
    const items = normal.updateShop()
    expect(items[0].quality).toBe(0)
  })
})

/* CONJURED */

describe('Conjured', function () {
  // Check that Conjured quality drops by 2 each day before sellIn
  it('-2 before sellIn', function () {
    const conjured = new Shop([new Conjured(CONJURED, 10, 10)])
    const items = conjured.updateShop()
    expect(items[0].quality).toBe(8)
  })

  // Check that Conjured quality drops by 4 each day after sellIn
  it('-4 after sellIn', function () {
    const conjured = new Shop([new Conjured(CONJURED, -1, 10)])
    const items = conjured.updateShop()
    expect(items[0].quality).toBe(6)
  })
})

const brie1 = new Brie(5, 10)
const brie2 = new Brie(1, 10)

const pass1 = passes(8, 10)
const pass2 = passes(2, 10)
const pass3 = passes(1, 10)

const bigTestShop = [
  brie1,
  brie2,
  pass1,
  pass2,
  pass3,
  new Conjured(CONJURED, 2, 10),
  new Conjured(CONJURED, 1, 10),
  sulfuras,
  new Item('normal item', 2, 10),
  new Item('normal item', 1, 10)
]

describe('Big test', function () {
  const bigShop = new Shop(bigTestShop)
  const items = bigShop.updateShop()
  it('Brie not expired', function () {
    expect(items[0].quality).toBe(11)
  })
  it('Brie expired', function () {
    expect(items[1].quality).toBe(12)
  })
  it('Passes 5-10', function () {
    expect(items[2].quality).toBe(12)
  })
  it('Passes 1-5', function () {
    expect(items[3].quality).toBe(13)
  })
  it('Passes expired', function () {
    expect(items[4].quality).toBe(0)
  })
  it('Conjured not expired', function () {
    expect(items[5].quality).toBe(8)
  })
  it('Conjured expired', function () {
    expect(items[6].quality).toBe(6)
  })
  it('Sulfuras', function () {
    expect(items[7].quality).toBe(80)
  })
  it('Normal not expired', function () {
    expect(items[8].quality).toBe(9)
  })
  it('Normal expired', function () {
    expect(items[9].quality).toBe(8)
  })
})
