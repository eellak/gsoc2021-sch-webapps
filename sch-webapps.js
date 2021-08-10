#!/usr/bin/env node

const { exit } = require('process');
const http = require('http');
const fs = require('fs');
const path = require('path')
const { spawnSync } = require('child_process');
const readline = require('readline');
const { inherits } = require('util');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const { networkInterfaces } = require('os');
const { join } = require('path');

function writeFileIfNotExists(fname, contents, options, callback) {
    if (typeof options === 'function') {
        // it appears that it was called without the options argument
        callback = options;
        options = {};
    }
    options = options || {};
    // force wx flag so file will be created only if it does not already exist
    options.flag = 'wx';
    fs.writeFile(fname, contents, options, function (err) {
        var existed = false;
        if (err && err.code === 'EEXIST') {
            // This just means the file already existed.
            // We will not treat that as an error, so kill the error code
            err = null;
            existed = true;
            console.log('Not overwriting existing file:', fname);
        }
        else {
            console.log('Created file:', fname);
        }
        if (typeof callback === 'function') {
            callback(err, existed);
        }
    });
}

function merge_package_json() {
    let packages = [];

    const folderPath = 'node_modules/';

    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            if (file2 == "package.json") {
                let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2);

                // reading each json and if it qualifies, we add it to var packages[]
                let rawdata = fs.readFileSync(jsonPath);
                let jsondata = JSON.parse(rawdata);
                let keyword = false;
                if (jsondata.hasOwnProperty('keywords')) {
                    for (i = 0; i < jsondata.keywords.length; i++) {
                        if (jsondata.keywords[i] == "photodentro" || jsondata.keywords[i] == "ts.sch.gr") {
                            keyword = true;
                            break;
                        }
                    }
                }

                let desc = jsondata.hasOwnProperty('description') &&
                    jsondata.description[0] != "" &&
                    jsondata.hasOwnProperty('icon') &&
                    jsondata.icon[0] != "";

                if (keyword && desc) {
                    // json qualifies
                    packages.push(jsondata);
                    console.log("   - Στην λίστα: " + jsondata.description);
                }

            }
        });

    });

    exports.packages = packages;
    console.log("Συνολικές εφαρμογές στην λίστα: " + packages.length);
    var superString = 'packages = [';
    for (i = 0; i < packages.length - 1; i++) {
        superString += JSON.stringify(packages[i]) + ', ';
    }
    superString += JSON.stringify(packages[packages.length - 1]) + ']';
    fs.writeFileSync('package-merged.js', superString);
}

function printAllApps() {
    let packages = [];

    const folderPath = 'node_modules/';

    console.log("Βρέθηκαν οι ακόλουθες εφαρμογές:");
    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            if (file2 == "package.json") {
                let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2);

                let rawdata = fs.readFileSync(jsonPath);
                let jsondata = JSON.parse(rawdata);

                let desc = jsondata.hasOwnProperty('description') &&
                    jsondata.description != "" &&
                    jsondata.hasOwnProperty('icon') &&
                    jsondata.icon != "";

                if (desc) {
                    // json qualifies
                    console.log("   - " + path.basename(file) + ": " + jsondata.description);
                }
            }
        });

    });
}

function display() {
    console.log(" ~~ ΜΕΝΟΥ ΕΠΙΛΟΓΩΝ ~~ ");
    console.log("0. Έξοδος");
    console.log("1. Προβολή εγκατεστημένων ιστοεφαρμογών");
    console.log("2. Εγκατάσταση ιστοεφαρμογών");
    console.log("3. Απεγκατάσταση ιστοεφαρμογών");
    console.log("4. Εκκίνηση web server");
}

function add(newApp) {
    spawnSync('npm install --registry=https://ts.sch.gr/npm ' + newApp, { stdio: 'inherit', shell: true });
}

function del(oldApp) {
    spawnSync('npm remove ' + oldApp, { stdio: 'inherit', shell: true });
}

function getIP() {
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return "0.0.0.0";
}

function startServer() {
    var dir = __dirname;

    var mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    };

    var server = http.createServer(function (req, res) {
        var reqpath = req.url.toString().split('?')[0];
        if (req.method !== 'GET') {
            res.statusCode = 501;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Method not implemented');
        }
        var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
        if (file.indexOf(dir + path.sep) !== 0) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Forbidden');
        }
        var type = mime[path.extname(file).slice(1)] || 'text/plain';
        var s = fs.createReadStream(file);
        s.on('open', function () {
            res.setHeader('Content-Type', type);
            s.pipe(res);
        });
        s.on('error', function () {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        });
    });
    server.listen(3000, function () {
        console.log('Διεύθυνση σύνδεσης στη συλλογή http://' + getIP() + ':3000/');
        console.log('Πατήστε Ctrl+C για τέλος');
    });
}

function menu() {
    display()

    rl.question(`Πληκτρολόγησε την επιλογή σου (0-4): `, (choice) => {

        switch (choice) {
            case '0':
                // Έξοδος
                exit();
                break;
            case '1':
                // Προβολή εγκατεστημένων πακέτων
                printAllApps();
                break;
            case '2':
                // Προσθήκη πακέτων
                rl.question('Πληκτρολογήστε τα πακέτα: ', (newApps) => {
                    add(newApps);
                    merge_package_json();
                    menu();
                });
                return;
            case '3':
                // Αφαίρεση πακέτων
                rl.question('Πληκτρολογήστε τα πακέτα: ', (oldApps) => {
                    del(oldApps);
                    merge_package_json();
                    menu();
                });
                return;
            case '4':
                // Εκκίνηση web server
                startServer();
                return;
            default:
                // Λάθος είσοδος
                console.log("Λάθος λειτουργία, πληκτρολογήστε έναν αριθμό από 0-4.")
        }
        menu();
    });
}

function parseArgs(args) {
    switch (args[0]) {
        case 'ls':
            printAllApps();
            break;
        case 'install':
        case 'i':
            add(args.slice(1).join(' '));
            break;
        case 'remove':
        case 'rm':
            del(args.slice(1).join(' '));
            break;
        case 'webserver':
            startServer();
            break;
        case 'index':
            merge_package_json();
            break;
        case 'import':
            spawnSync('nodejs import.js ' + args.slice(1).join(' '), { stdio: 'inherit', shell: true });
            break;
        case 'publish':
            spawnSync('npm publish --registry=https://ts.sch.gr/npm', { stdio: 'inherit', shell: true });
            break;
        default:
            console.log('Λάθος εντολή');
    }
}

function init() {
    // 1) an den yparxei package.json, ftiaxe ena mikro
    var json = `{
                    "description": "Ιδιωτική συλλογή",
                    "license": "CC-BY-SA-4.0",
                    "version": "1.0.0"
                } `;
    writeFileIfNotExists('package.json', json + '\n');

    // bl. to collection/package.json
    // 2) an den yparxei node_modules/sch-webapps,
    // egkatesthse to trexontas npm i --registry... sch-webapps
    try {
        if (!fs.existsSync("node_modules/sch-webapps")) {
            spawnSync('npm install sch-webapps', { stdio: 'inherit', shell: true });
        }
    } catch (err) {
        console.error(err)
    }
    // 3) ftiaxe kai ena template index.html
    // fs.copyFile('node_modules/sch-webapps/index.html', 'index.html', (err) => {
    //     if (err) throw err;
    //     console.log('success');
    // });

    var args = process.argv.slice(2);
    console.log(args);
    if (args.length > 0) {
        parseArgs(args);
    } else
        menu();
}

init();