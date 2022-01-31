# iptv-serve

Static server for m3u and epg files

### Requeriments
- [xmltv-util](https://github.com/XMLTV/xmltv)

#### Debian/Ubuntu

```bash
sudo apt install xmltv
```

#### Fedora/CentOS (via RPM Fusion)

```bash
dnf install xmltv
```

### Instalation

```bash
git clone https://github.com/hartontw/iptv-serve.git
cd iptv-serve
npm install
```

### Configuration

- Create .env file inside project folder or set environment variables

PORT (3000): Listening port
FOLDER (public): Folder where files are served
FILES (files.json): JSON file with urls and names to download an write in disk drive
CRON_RULE (0 0 0 * * *): Cronjob rule to start the download and merge epg files
CRON_ZONE (optional): Time Zone to start the job.

- Create files.json (or set another name in environment variable) inside project folder
Example:
```files.json```
```json
{
    "m3u": [
        { "name": "Pluto", "url": "https://raw.githubusercontent.com/matthuisman/i.mjh.nz/master/PlutoTV/all.m3u8" }
    ],
    "epg": [
        { "name": "Pluto", "url": "https://raw.githubusercontent.com/matthuisman/i.mjh.nz/master/PlutoTV/all.xml" }
    ]
}
```

### Run

CLI
```bash
npm start
```

PM2 
```ecosystem.config.js```
```js
module.exports = {
    apps: [
        {
            name: "iptv-serve",
            script: "~/iptv-serve/index.js",
            env: {
                PORT: 4000,
                CRON_RULE: "0 0 5 * * *"
            }
        }
    ]
};
```
