const symbols = ['|', '/', '-', '\\']
let count = 0

function tick() {
  process.stdout.write('\b' + symbols[count++ % 4])
}

setInterval(tick, 300)