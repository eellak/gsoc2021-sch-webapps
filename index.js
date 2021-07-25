#!/usr/bin/env node

const { exit } = require('process');
const http = require('http');
const fs = require('fs');
const path = require('path')
const { spawnSync } = require('child_process');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function merge_package_json() {
    let packages = [];

    const folderPath = 'node_modules/@ts.sch.gr/';

    //console.log("Searching for apps in 'collection' file to add...");
    fs.readdirSync(folderPath).forEach(file => {
        console.log("1: " + path.dirname(folderPath + path.basename(file)));
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            console.log("2: " + folderPath + path.basename(file) + "/" + path.basename(file2));
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
                    jsondata.hasOwnProperty('thumbnails') &&
                    jsondata.thumbnails[0] != "";

                if (keyword && desc) {
                    // json qualifies
                    packages.push(jsondata);
                    console.log("   - Added " + jsondata.description);
                }

            }
        });

    });

    exports.packages = packages;
    //console.log("Total apps added: " + packages.length);
    var superString = 'packages = [';
    for (i = 0; i < packages.length - 1; i++) {
        superString += JSON.stringify(packages[i]) + ', ';
    }
    superString += JSON.stringify(packages[packages.length - 1]) + ']';
    fs.writeFileSync('package-merged.js', superString);
}

function printAllApps() {
    let packages = [];

    const folderPath = 'node_modules/@ts.sch.gr/';

    console.log("Βρέθηκαν οι ακόλουθες εφαρμογές:");
    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            if (file2 == "package.json") {
                let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2);

                let rawdata = fs.readFileSync(jsonPath);
                let jsondata = JSON.parse(rawdata);

                let desc = jsondata.hasOwnProperty('description') &&
                    jsondata.description[0] != "" &&
                    jsondata.hasOwnProperty('thumbnails') &&
                    jsondata.thumbnails[0] != "";

                if (desc) {
                    // json qualifies
                    console.log("   - " + path.basename(file) + ": " + jsondata.description);
                }
            }

            //});
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
    spawnSync('npm install @ts.sch.gr/' + newApp, { stdio: 'inherit', shell: true });
}

function del(oldApp) {
    spawnSync('npm remove @ts.sch.gr/' + oldApp, { stdio: 'inherit', shell: true });
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
    //var choice;
    display()

    // 'Πληκτρολόγησε 0-4: '
    rl.question(`Please enter a choice: `, (choice) => {

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
                rl.question('Πληκτρολογήστε τα πακέτα: ', (newApp) => {
                    add(newApp);
                    merge_package_json();
                    menu();
                });
                return;
            case '3':
                // Αφαίρεση πακέτων
                rl.question('Πληκτρολογήστε τα πακέτα: ', (oldApp) => {
                    delete(oldApp);
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

menu();