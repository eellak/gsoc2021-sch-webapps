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
    console.log(" ~~ MENU ~~ ");
    console.log("0. Έξοδος");
    console.log("1. Προβολή εγκατεστημένων πακέτων");
    console.log("2. Προσθήκη πακέτων");
    console.log("3. Αφαίρεση πακέτων");
    console.log("4. Εκκίνηση web server");
}

function add(newApp) {
    spawnSync('npm install --registry=https://ts.sch.gr/npm ' + newApp, { stdio: 'inherit', shell: true });
}

function del(oldApp) {
    spawnSync('npm remove ' + oldApp, { stdio: 'inherit', shell: true });
}

function startServer() {
    const PORT = 3000;

    const folderPath = 'index.html';

    var index = fs.readFileSync(folderPath);
    console.log(index);

    http.createServer(function(request, response) {
        console.log('lalala: ' + request.url);
        response.writeHeader(200, { "Content-Type": "text/html" });
        var readStream = fs.createReadStream(folderPath, 'utf8');
        readStream.pipe(res);
        // response.write(index);
        // response.end();
    }).listen(PORT, '127.0.0.1');


}

function menu() {
    display()

    rl.question(`Πληκτρολόγησε 0-4 `, (choice) => {

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
                console.log("Not working yet!");
                //startServer();
                break;
            default:
                // Λάθος είσοδος
                console.log("Λάθος λειτουργία, πληκτρολογήστε έναν αριθμό από 0-4.")
        }
        menu();
    });
}

function init() {
    // 1) an den yparxei package.json, ftiaxe ena mikro
    // bl. to collection/package.json
    // 2) an den yparxei node_modules/sch-webapps,
    // egkatesthse to trexontas npm i --registry... sch-webapps
    // 3) ftiaxe kai ena template index.html
}

init();
menu();