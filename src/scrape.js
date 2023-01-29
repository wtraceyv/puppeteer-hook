/**
 * Use headless browser to scrape for pics I want 
 */

import puppeteer from 'puppeteer';

/**
 * open a browser, scrape one page per product in same browser for each scrape
 * 
 * @param {*} nameUrlPairsList, array of input objects in form {url: "Url", productName: "Name"}
 * @param {*} scrapeFunction, pointer to which scrape function (different websites)
 * @returns saveResults, array of objects containing scraped info
 */
async function scrapeList(nameUrlPairsList, scrapeFunction) {
    var saveResults = [];
    const browser = await puppeteer.launch({ headless: true });

    await Promise.all(nameUrlPairsList.map(async (p) => {
        // will have a 'feat' and 'label' prop filled in
        const newProps = await scrapeFunction(browser, p['url']);
        p['featuredUrl'] = newProps.featuredUrl;
        p['labelUrl'] = newProps.labelUrl;

        saveResults.push(newProps);
    }));

    await browser.close();

    return saveResults;
}

/**
 * Scrape for one set of pics for a product; pecific to Pure Encapsulations website
 * 
 * @param {*} browser, puppeteer browser to add my link to
 * @param {*} url, url to open page to and scrape from
 * @returns {featuredUrl, labelUrl}, object containing scraped URLs to featured and supplement fact pics
 */
async function pureScrape(browser, url) {
    var feat, label;
    const page = await browser.newPage();
    console.log(`Navigating to: ${url}`);

    await page.goto(
        url,
        { waitUntil: "domcontentloaded" }
    );
    await page.setViewport({ width: 1920, height: 1080 });

    // click magnifying area to get to slideshow of pics
    const toSelect = 'div.fotorama__stage__frame';
    await page.waitForSelector(toSelect, { timeout: 20000 });
    await page.click(toSelect);

    // grab featured link
    const imgSelect = 'div.fotorama__active > img.fotorama__img--full';
    var featSelector = await page.waitForSelector(imgSelect, { timeout: 20000 });
    feat = await featSelector.evaluate(e => e.getAttribute('src'));

    // click to next picture in slideshow (should be supplement facts)
    const nextButtonSelector = 'div.fotorama__arr--next';
    await page.waitForSelector(nextButtonSelector, { timeout: 3000 });
    await page.click(nextButtonSelector, { delay: 1000 });
    await new Promise(w => setTimeout(w, 2000));

    // grab supp facts link
    var labelSelector = await page.waitForSelector(imgSelect, { timeout: 20000 });
    label = await labelSelector.evaluate(e => e.getAttribute('src'));

    await page.close();

    return { featuredUrl: feat, labelUrl: label };
}

export default {
    scrapeList,
    pureScrape
}
