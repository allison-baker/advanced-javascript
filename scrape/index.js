import puppeteer from 'puppeteer'
import fs from 'fs'
import ProgressBar from 'progress'

/*
NOTE: I'm running in Windows Subsystem for Linux, so there were some extra steps I had to take for this to work.
1. Install Chromium in WSL: sudo apt-get install chromium-browser
2. Specify the executablePath in puppeteer.launch() to point to the Chromium executable
*/

(async () => {
    const pgStart = process.argv.slice(2)[0] || 1
    const bar = new ProgressBar(':bar', { total: 100 - pgStart + 1 })

    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: 'new'
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })

    // Pick up where you left off by parsing the JSON file (if it exists)
    let pwTexts = fs.existsSync('mcupws.json') ? JSON.parse(fs.readFileSync('mcupws.json', 'utf8')) : []

    // i.e. If starting on page 3, the JSON file should have 200 words in it
    if (pwTexts.length !== (pgStart - 1) * 100) {
        console.error('mcupws.json is not up to date with the page number provided. Please run the script with the correct page number.')
        process.exit()
    }

    for (let i = pgStart; i <= 100; i++) {
        await page.goto(`https://www.passwordrandom.com/most-popular-passwords/page/${i}`)

        try {
            let currPage = await page.evaluate(() => [...document.querySelectorAll('td:nth-child(2)')].map((pw) => pw.textContent))
            if (currPage.length !== 100) throw new Error('Unable to complete, please restart')

            pwTexts = [...pwTexts, ...currPage]
            fs.writeFileSync('mcupws.json', JSON.stringify(pwTexts, null, 2))

            bar.tick()
        } catch (error) {
            console.log(`\n${error.message} page ${i}`)
            process.exit()
        }
    }
    console.log('\nComplete')
    await browser.close()

    pwTexts = pwTexts.filter(pw => pw.match(/^[a-zA-Z0-9]+$/))

    fs.writeFileSync('mcupws.json', JSON.stringify(pwTexts, null, 2))
})()
