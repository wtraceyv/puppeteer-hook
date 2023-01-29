/**
 * Take input list of urls and product names to attempt to scrape.
 * Handle initial logging and send every url to grab pics to scrape, download, name
 */

import config from "../config.js" ;

import n from "./naming.js";
import s from "./scrape.js";
import r from "./read.js";
import d from "./download.js";

// must be exported csv, pls
const dataFile = config.dataFile;
const downloadTo = config.downloadTo;
const pagesPerStage = config.pagesPerStage;

// Parse csv for array of objects to use
const csvDataAsArrays = r.inputToObjects(dataFile);

// TODO: This part is custom for whatever is in csv.
// Make sure you are inserting the correct index via csv column into the right key.
var masterObjects = [];
csvDataAsArrays.forEach((a) => {
    masterObjects.push({ productName: a[0], url: a[1] });
});

// Staged scraping for pic links to add to objects (not too many browser pages at once)
var testList = masterObjects.slice(0, masterObjects.length);
const stages = Math.floor((testList.length / pagesPerStage) + 1);
for (var stage = 0; stage < stages; stage++) {
    console.log(`Scraping stage ${stage + 1} of ${stages}, ${pagesPerStage} pages per stage.`)
    // avoid trying to scrape beyond the list
    var startIndex = stage * pagesPerStage;
    var pages = (startIndex > testList.length)
        ? testList.length - (startIndex)
        : pagesPerStage;
    console.log("Scraping between indices: ", startIndex, " ", startIndex + pages);

    // Scrape and insert image links
    await s.scrapeList(testList.slice(startIndex, startIndex + pages), s.pureScrape);

    // Generate filenames and add those to objects
    n.insertFileNames(testList.slice(startIndex, startIndex + pages), 'Pure Encapsulations');

    // download this chunk in case we fail in the middle
    testList.slice(startIndex, startIndex + pages).forEach((o) => {
        d.downloadPic(o.featuredUrl, downloadTo + o.featuredName + '.webp');
        d.downloadPic(o.labelUrl, downloadTo + o.labelName + '.webp');
    });
}
