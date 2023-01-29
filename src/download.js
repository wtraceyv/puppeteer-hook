/**
 * Handle downloading / naming scraped files locally
 */

import fs from "fs";

// fetch pic at given url, store it at storePath (with desired name of file)
async function downloadPic(url, storePath) {
    fetch(url)
        .then(res => { return res.blob(); })
        .then((blob) => { return blob.arrayBuffer(); })
        .then((buffer) => { return Buffer.from(buffer); })
        .then((sBuffer) => { fs.writeFileSync(storePath, sBuffer) });
}

export default {
    downloadPic
}