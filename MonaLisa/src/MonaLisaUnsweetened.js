function clamp(min, max) {
    return function (x) {
        if (x < min) return min
        if (x > max) return max
        return x
    }
}

const qualityClamp = clamp(0, 50)

class Item {
    constructor(name, sellIn, quality) {
        this.name = name
        this.sellIn = sellIn
        this.quality = quality
    }
    updateQuality() {
        if (this.sellIn > 0) this.quality -= 1
        else this.quality -= 2
        this.quality = qualityClamp(this.quality)
    }
}

function Brie(sellIn, quality) {
    this.name = 'Aged Brie'
    this.sellIn = sellIn
    this.quality = quality
    this.updateQuality = () => {
        if (this.sellIn > 0) this.quality++
        else this.quality += 2
        this.quality = qualityClamp(this.quality)
    }
}

class Conjured extends Item {
    updateQuality() {
        if (this.sellIn > 0) this.quality -= 2
        else this.quality -= 4
        this.quality = qualityClamp(this.quality)
    }
}

function passes (sellIn, quality) {
    return {
        name: 'Backstage passes to a TAFKAL80ETC concert',
        sellIn,
        quality,
        updateQuality() {
            if (this.sellIn > 10) {
                this.quality++
            } else if (this.sellIn > 5 && this.sellIn <= 10) {
                this.quality += 2
            } else if (this.sellIn > 0 && this.sellIn <= 5) {
                this.quality += 3
            } else this.quality = 0
            this.quality = qualityClamp(this.quality)
        }
    }
}

const sulfuras = {
    name: 'Sulfuras, Hand of Ragnaros',
    quality: 80,
    sellIn: 0,
    updateQuality() {
        return
    }
}

class Shop {
    constructor(items = []) {
        this.items = items
    }
    updateShop() {
        for (let item of this.items) {
            item.sellIn -= 1
            item.updateQuality()
        }

        return this.items
    }
}

module.exports = {
    Item,
    Shop,
    Brie,
    Conjured,
    passes,
    sulfuras
}
