require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const download = require('./download');
const merge = require('./merge');
const fs = require('fs');
const CronJob = require('cron').CronJob;

const PORT = process.env.PORT || 3000;
const FOLDER = process.env.FOLDER || 'public';
const FILES = process.env.FILES || 'files.json';
const CRON_RULE = process.env.CRON_RULE || '0 0 0 * * *'; // Everyday at 12 AM
const CRON_ZONE = process.env.CRON_ZONE

app.use(express.static(path.join(__dirname, FOLDER)))

let lock = false;
const getFiles = new CronJob(CRON_RULE, async () => {

    if (lock) return;

    lock = true;

    console.log("||| Downloading files |||");

    const files = JSON.parse(fs.readFileSync(FILES, 'utf-8'));

    const join = (name, ext) => {
        return path.join(FOLDER, `${name}.${ext}`)
    }

    if (files.m3u) {
        files.m3u.forEach(f => {
            const timestamp = new Date().toISOString();
            download(f.url, join(f.name, 'm3u'))
            .then(()=> {
                console.log(`${timestamp}: ${f.name}.m3u downloaded.`);
            })
            .catch(err => {
                console.error(`${timestamp}: ${err.message}`);
            })
        });
    }

    if (!files.epg) {
        console.log("||| Files downloaded |||");
        lock = false;
        return;
    }

    const dwnl = async f => {
        const timestamp = new Date().toISOString();
        try {
            await download(f.url, join(f.name, 'xml'));
            console.log(`${timestamp}: ${f.name}.xml downloaded.`);
        }        
        catch(err) {
            console.error(`${timestamp}: ${err.message}`);
        }
    }    

    const epg = [];
    files.epg.forEach(f => {
        epg.push(dwnl(f));
    });
    await Promise.all(epg);

    console.log("||| Files downloaded |||");
    
    console.log('');

    console.log('||| Merging Files ||| ');
    await merge(files.epg.map(f => join(f.name, 'xml')));
    console.log('||| Files merged ||| ');

    lock = false;
    
}, CRON_ZONE);
  
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

getFiles.start();