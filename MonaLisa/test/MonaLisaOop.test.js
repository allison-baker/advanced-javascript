const { Shop, Item, Brie, Conjured, Passes, Sulfuras } = require('../src/MonaLisaOop')
const SULFURAS = 'Sulfuras, Hand of Ragnaros'
const PASSES = 'Backstage passes to a TAFKAL80ETC concert'
const BRIE = 'Aged Brie'
const CONJURED = 'Conjured'

/* SULFURAS */

describe('Sulfuras', function () {
  // Check that Sulfuras quality never degrades, even after expiration
  it('Always quality 80', function () {
    const sulfurasShop = new Shop([new Sulfuras(SULFURAS, 0, 80)])
    const items = sulfurasShop.updateShop()
    expect(items[0].quality).toBe(80)
  })
})

/* BACKSTAGE PASSES */

describe('BackstagePasses', function () {
  // Check that Backstage passes are set to 0 when expired
  it('0 after expiry', function () {
    const backstage = new Shop([new Passes(PASSES, 0, 10)])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(0)
  })

  // Check that Backstage passes increase by 2 when 10 days or less from sellIn
  it('+2 less than 10 days from sellIn', function () {
    const backstage = new Shop([new Passes(PASSES, 8, 10)])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(12)
  })

  // Check that Backstage passes increase by 3 when 5 days or less from sellIn
  it('+3 less than 5 days from sellIn', function () {
    const backstage = new Shop([new Passes(PASSES, 3, 10)])
    const items = backstage.updateShop()
    expect(items[0].quality).toBe(13)
  })
})

/* AGED BRIE */

describe('AgedBrie', function () {
  // Check that Aged Brie never goes over 50 in quality
  it('Quality under 50', function () {
    const agedBrie = new Shop([new Brie(BRIE, 1, 50)])
    const items = agedBrie.updateShop()
    expect(items[0].quality).toBe(50)
  })

  // Check that Aged Brie increases x2 in quality after expiry
  it('Increase after expiry', function () {
    const agedBrie = new Shop([new Brie(BRIE, -1, 10)])
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
