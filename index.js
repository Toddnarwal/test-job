// Filename: index.js

const express = require('express');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const app = express();

app.get("/*", async (req, res) => {
    const fullUrl = req.originalUrl;
    if (fullUrl.match(/^\/http*.:\/\//i)) {
        (async () => {
            const url = fullUrl.substring(1, fullUrl.length);
            const browser = await puppeteer.launch({
                headless: 'new',
                defaultviewport: null,
                args: [
                    "--no-sandbox",
                    "--disable-gpu",
                    "--start-maximized",
                ]
            })
            const page = await browser.newPage();
            try {
                await page.goto(url, { waitUntil: "networkidle0", timeout: 10000 });
            } catch (e) {
                console.log("Oops! - " + e.message);
            }
            await page.waitForTimeout(2000)
            let imageBuffer = await page.screenshot({ type: "png", fullPage: true });
            await page.close();
            await browser.close();
            res.set('Content-Type', 'image/png');
            res.send(imageBuffer);
            const datetime = new Date();
            console.log(datetime.toLocaleString('en-US'));
            console.log(url);
            const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
            console.log(ipAddress);
        })();
    } else {
        res.status(204);
        res.end();
    }
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
});
