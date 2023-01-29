/**
 * Read .csv files into JS objects so we can take in input from one place.
 */

import fs from "fs";

// ignore specific columns, just return whatever is given
function inputToObjects(inputFile) {
    var sets = [];
    const data = fs.readFileSync(inputFile, { encoding: 'utf8' });

    // for some reason the csv arrives with \r appended
    // https://stackoverflow.com/questions/7328145/is-it-possible-to-replace-all-carriage-returns-in-a-string-via-replace
    data.replace(/[\r]/g, '').split('\n').forEach((line) => {
        const props = line.split(',');
        sets.push(props);
    });

    return sets;
}

export default {
    inputToObjects
}