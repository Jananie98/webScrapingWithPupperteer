import puppeteer from "puppeteer";

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false, // We can see what is happening
            defaultViewport: null,
        });
        const page = await browser.newPage();

        await page.goto("https://zigzag.lk/", {
            waitUntil: "domcontentloaded",
        });

        //-------------------------------------------------
        // Attempt 1
        //------------------------------------------------


        // const products2 = await page.evaluate(() => {
        //     const productList = document.querySelectorAll('#shopify-section-1586282516064 > sorting-collections > div > div > div.sorting-collections__products.row > div:nth-child(1)');
        //     return Array.from(productList).map((product) => {
        //         const name = product.querySelector('#shopify-section-1586282516064 > sorting-collections > div > div > div.sorting-collections__products.row > div:nth-child(1) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__title.mb-3 > h4 > a').textContent.trim();
        //         const price = product.querySelector('#shopify-section-1586282516064 > sorting-collections > div > div > div.sorting-collections__products.row > div:nth-child(1) > product-item > div > form > div.product-collection__content.d-flex.flex-column.align-items-start.mt-15 > div.product-collection__price.mb-10 > span > span > span').textContent.trim();
        //         const image = product.querySelector('#shopify-section-1586282516064 > sorting-collections > div > div > div.sorting-collections__products.row > div:nth-child(1) > product-item > div > form > div.product-collection__image.product-image.product-image--hover-fade.position-relative.w-100.js-product-images-navigation.js-product-images-hovered-end.js-product-images-hover > a > div > img');
        //         return { name, price, image };
        //     });
        // });

        //-------------------------------------------------
        // Attempt 2
        //-------------------------------------------------
        const products2 = await page.evaluate(() => {
            const productList = document.querySelectorAll('#shopify-section-1586282516064 sorting-collections div.sorting-collections__products.row product-item');
        
            return Array.from(productList).map((product) => {
                const name = product.querySelector('.product-collection__title h4 a').textContent.trim();
                const price = product.querySelector('.product-collection__price span').textContent.trim();
                const imageElement = product.querySelector('.product-collection__image img');
                const image = imageElement ? imageElement.src : '';
        
                return { name, price, image };
            });
        });
        console.log(products2);
        await browser.close();
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
