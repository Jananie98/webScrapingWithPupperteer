import puppeteer from "puppeteer";
import fetch from 'node-fetch';
import { parseString } from 'xml2js';

//-------------------------------------------------
// Scrape from XML File --> sitemap.xml
//-------------------------------------------------

// FIXME: to iterate all rows in sitemap table
const url = 'https://zigzag.lk/sitemap.xml';

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(xmlData => {
        parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            // all the loc in sitemap.xml file
            const locs = result?.sitemapindex?.sitemap?.map(entry => entry.loc);

            //-------------------------------------------------
            // Scrape from XML File --> sitemap_products.xml
            //-------------------------------------------------
            // FIXME: Clarify!
            locs.slice(0,3).forEach(loc =>{
            const productsURL = loc;
            fetch(productsURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(xmlData => {
                parseString(xmlData, (err, productset) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
                    const productLocs = productset?.urlset?.url?.map(loc => loc.loc);
                    productLocs.slice(1,2).forEach(productLoc =>{
                        (async () => {
                            try {
                                const browser = await puppeteer.launch({
                                    headless: true, // We can't see what is happening
                                    defaultViewport: null,
                                });
                                const page = await browser.newPage();
                                console.log(productLoc)
                                // FIXME: to goto all product pages
                                await page.goto(productLoc[0], {
                                    waitUntil: "domcontentloaded",
                                });
                        
                                const products3 = await page.evaluate(() => {
                                    return new Promise((resolve, reject) => {
                                        try {
                                            const name = document.querySelector('#shopify-section-template--16740981178619__main > div.product-page.mt-30.pb-30 > div > div > div.product-page__main > single-product > div > div:nth-child(2) > div > form > div.product-page-info__title.mb-15.text-center.text-md-left > h1').textContent.trim();
                                            const price = document.querySelector('#shopify-section-template--16740981178619__main > div.product-page.mt-30.pb-30 > div > div > div.product-page__main > single-product > div > div:nth-child(2) > div > form > div.product-page-info__price.text-center.text-md-left.mb-25 > span > span > span').textContent.trim();
                                            // TODO: Get the image (Option-2)
                                            // const imageElement = document.querySelector('#shopify-section-template--16740981178619__main > div.product-page.mt-30.pb-30 > div > div > div.product-page__main > single-product > div > div.col-12.col-md-6.index-10.sticky-sidebar.js-sticky-sidebar > div > product-gallery > div.product-gallery__content.d-md-flex > div.product-gallery__main.position-relative.order-md-1 > div > div.product-gallery__main_slider.js-slider-tracking.slick-initialized.slick-slider > div > div > div.product-gallery__main_item.product-gallery__main_item--type-image.position-relative.overflow-hidden.slick-slide.slick-current.slick-active > div > div > div > img').content;
                                            // const image = imageElement ? imageElement.src : '';
                                            resolve({ name, price });
                                            console.log(name)
                                            console.log(price)
                                        } catch (error) {
                                            reject(error);
                                        }
                                    });
                                });
                        
                                console.log(products3);
                        
                                await browser.close();
                            } catch (error) {
                                console.error("An error occurred:", error);
                            }
                        })();
                    })
                    // TODO: Get the image(Option1)
                                       
                });
            })
            .catch(error => {
                console.error('Error fetching XML:', error);
            });
            })
            //-------------------------------------------------
            // End of XML File --> sitemap_products.xml
            //------------------------------------------------- 
        });
    })
    .catch(error => {
        console.error('Error fetching XML:', error);
    });

//-------------------------------------------------
// End of XML File --> sitemap.xml
//-------------------------------------------------

