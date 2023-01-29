/**
 *  Handle proper file naming after downlaods 
 */

/**
 * Main program seems to be working by passing around a master list to append results to.
 * This is just to enable the same style of calling.
 * 
 * @param {*} objectsList, objects in array must contain key "productName"
 */
function insertFileNames(objectsList, brandName) {
    objectsList.forEach(o => {
        o['featuredName'] = getFeatFileName(brandName, o['productName']);
        o['labelName'] = getLabelFileName(brandName, o['productName']);
    });
}

function makeFileName(brandName, productName) {
    var formatBrand = brandName.slice().toLowerCase().replace(" ", "-").replace("\n", "");
    var formatProd = productName.slice().toLowerCase().replace(" ", "-").replace("\n", "");
    return formatBrand + "_" + formatProd; 
}

function getFeatFileName(brandName, productName) {
    return makeFileName(brandName, productName) + "_featured";
}

function getLabelFileName(brandName, productName) {
    return makeFileName(brandName, productName) + "_label";
}

export default {
    getFeatFileName,
    getLabelFileName,
    insertFileNames
}