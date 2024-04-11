const SULFURAS = 'Sulfuras, Hand of Ragnaros'
const PASSES = 'Backstage passes to a TAFKAL80ETC concert'
const BRIE = 'Aged Brie'
const CONJURED = 'Conjured'

function clamp(min, max) {
  return function (x) {
    if (x < min) return min
    if (x > max) return max
    return x
  }
}

const qualityClamp = clamp(0, 50)

// Define a Item class with a constructor method that has three properties: name, sellIn, and quality
class Item {
  constructor(name, sellIn, quality) {
    this.name = name
    this.sellIn = sellIn
    this.quality = quality
  }
}

// Define a Shop class with a constructor method that has one property: items array
class Shop {
  constructor(items = []) {
    this.items = items
  }
  updateQuality() {
    for (let item of this.items) {
      if (item.name != 'Sulfuras, Hand of Ragnaros') {
        item.sellIn = item.sellIn - 1
      }

      switch (item.name) {
        case SULFURAS:
          break
        case PASSES:
          if (item.sellIn > 10) {
            item.quality++
          } else if (item.sellIn > 5 && item.sellIn <= 10) {
            item.quality += 2
          } else if (item.sellIn > 0 && item.sellIn <= 5) {
            item.quality += 3
          } else item.quality = 0
          item.quality = qualityClamp(item.quality)
          break
        case BRIE:
          if (item.sellIn > 0) item.quality++
          else item.quality += 2
          item.quality = qualityClamp(item.quality)
          break
        case CONJURED:
          if (item.sellIn > 0) item.quality -= 2
          else item.quality -= 4
          item.quality = qualityClamp(item.quality)
          break
        default:
          if (item.sellIn > 0) item.quality -= 1
          else item.quality -= 2
          item.quality = qualityClamp(item.quality)
      }
    }

    return this.items
  }
}

module.exports = {
  Item,
  Shop,
}
