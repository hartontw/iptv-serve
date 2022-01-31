const fs = require('fs');
const download = require('download');

module.exports = async (url, dest) => {
    fs.writeFileSync(dest, await download(url));
};