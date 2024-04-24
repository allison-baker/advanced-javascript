console.log('\nloading')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isPrimary) {
    const qty = process.argv.slice(2).map(Number).pop()
    const splitQty = qty / numCPUs

    console.log(`Primary: I have ${qty} thing(s) to do`)
    console.log('Primary: I will get my workers to do it for me')
    
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork()
        let msg = { id: i + 1, start: i * splitQty, end: i * splitQty + splitQty }
        console.log(msg)
        worker.send(msg)
        worker.on('message', (text) => console.log(`Primary: my Worker reports: ${text}`))
    }
} else {
    process.on('message', ({ id, start, end }) => {
        console.log(`Worker ${id}: I have work to do from ${start} to ${end}`)
        process.send(`Worker ${id}: all done with my ${end - start} thing(s)`)
        process.exit()
    })
}