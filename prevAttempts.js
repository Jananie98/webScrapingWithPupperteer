import puppeteer from "puppeteer";

// const puppeteer = require('puppeteer-extra')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

// const {executablePath} = require('puppeteer')

// puppeteer.launch({ headless: true, executablePath: executablePath }).then
(async () => {
    const browser = await puppeteer.launch({
        headless: false, // we can see what is happening
        defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto("https://zigzag.lk/", {
        // waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('#header > sticky-header > div.header__content > div:nth-child(3) > div > div.container.d-lg-flex > div > nav > div > div:nth-child(6) > a', { timeout: 60000 });
    await page.click('#header > sticky-header > div.header__content > div:nth-child(3) > div > div.container.d-lg-flex > div > nav > div > div:nth-child(6) > a');

    // Attempt 1

    const grabDetails = await page.evaluate(() => {
    const nameTags = document.querySelector("#CollectionProductGrid > div:nth-child(1) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__title.mb-3 > h4 > a");
    const priceTags = document.querySelector("#CollectionProductGrid > div:nth-child(1) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__price.mb-10 > span > span > span");

    console.log(nameTags);
    console.log(priceTags);
    return grabDetails;

    })

    // Attempt 2
    // Get page data

    const products = await page.evaluate(() => {
        const productList = document.querySelectorAll('#CollectionProductGrid > div:nth-child(2) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15');
        return Array.from(productList).map((product) => {
            const name = product.querySelectorAll('#CollectionProductGrid > div:nth-child(2) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__title.mb-3 > h4 > a').innerText;
            const price = product.querySelectorAll('#CollectionProductGrid > div:nth-child(2) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__price.mb-10 > span > span > span').innerText;
            console.log(name)
            console.log(price)
            return { name, price };
        });
    });

    // Attempt- 3
    const products2 = await page.evaluate(() => {
        const productList = document.querySelectorAll('#CollectionProductGrid > div:nth-child(2) > product-item');
        return Array.from(productList).map((product) => {
            const name = product.querySelector('div.product-collection__content > div.product-collection__title > h4 > a').textContent.trim();
            const price = product.querySelector('div.product-collection__content > div.product-collection__price > span > span > span').textContent.trim();
            console.log(name);
            console.log(price);
            return { name, price };
        });
    });


    
    console.log(products);
    console.log(products2);
    await browser.close();

    // Attempt-4

    const product = await (await page.$eval('#CollectionProductGrid > div:nth-child(2) > product-item', element => element.textContent.trim()));
            const price = await page.$eval('div.product-collection__content > div.product-collection__title > h4 > a', element => element.textContent.trim());
            const name = await page.$eval('div.product-collection__content > div.product-collection__price > span > span > span', element => element.textContent.trim());
            console.log(name);
            console.log(price);
            console.log(product)

    console.log(products);
    await browser.close();
})();