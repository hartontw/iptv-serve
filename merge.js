const { Console } = require('console');
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const MASTER = path.join(process.env.FOLDER, 'master.xml');
const MERGED = path.join(process.env.FOLDER, 'merged.xml')

async function merge(master, add) {
    const { stdout, stderr } = await exec(`tv_merge -i ${master} -m ${add} -o ${MERGED}`);
    const timestamp = new Date().toISOString();
    if (stdout) console.log(`${timestamp}: ${stdout}`);
    if (stderr) console.error(`${timestamp}: ${stderr}`);
}

module.exports = async (files) => {
    if (files.length < 1) return;

    if (files.length > 1) {
        await merge(files[0], files[1]);
        for(let i=2; i<files.length; i++) {
            await merge(MERGED, files[i]);
        }
    }

    if (fs.existsSync(MASTER)) {
        fs.rmSync(MASTER);
    }

    if (files.length === 1) {
        fs.copyFileSync(files[0], MASTER);
    }
    else if (fs.existsSync(MERGED)) {
        fs.copyFileSync(MERGED, MASTER);    
        fs.rmSync(MERGED);
    }
}