#!/usr/bin/env node

function merge_package_json() {
    let packages = [];

    const fs = require('fs');
    const path = require('path')
    const folderPath = '../collection/node_modules/';

    console.log("Searching for apps in 'collection' file to add...");
    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            fs.readdirSync(folderPath + path.basename(file) + "/" + path.basename(file2)).forEach(file3 => {
                if (file3 == "package.json") {
                    let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2) + "/" + path.basename(file3);

                    // reading each json and if it qualifies, we add it to var packages[]
                    let rawdata = fs.readFileSync(jsonPath);
                    let jsondata = JSON.parse(rawdata);
                    let keyword = false;
                    for (i = 0; i < jsondata.keywords.length; i++) {
                        if (jsondata.keywords[i] == "photodentro" || jsondata.keywords[i] == "ts.sch.gr") {
                            keyword = true;
                            break;
                        }
                    }
                    let desc = jsondata.hasOwnProperty('description') &&
                        jsondata.description[0] != "" &&
                        jsondata.hasOwnProperty('thumbnails') &&
                        jsondata.thumbnails[0] != "";

                    if (keyword && desc) {
                        // json qualifies
                        packages.push(jsondata);
                        console.log("Added " + jsondata.description);
                    }

                }

            });
        });

    });

    // exports.packages = packages;
    console.log("Total apps added: " + packages.length);
    var superString = 'packages = [';
    for (i = 0; i < packages.length - 1; i++) {
        superString += JSON.stringify(packages[i]) + ', ';
    }
    superString += JSON.stringify(packages[packages.length - 1]) + ']';
    fs.writeFileSync('package-merged.js', superString);
}
//merge_package_json();

function printAllApps() {
    let packages = [];

    const fs = require('fs');
    const path = require('path')
    const folderPath = '../collection/node_modules/';

    console.log("Βρέθηκαν οι ακόλουθες εφαρμογές:");
    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            fs.readdirSync(folderPath + path.basename(file) + "/" + path.basename(file2)).forEach(file3 => {
                if (file3 == "package.json") {
                    let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2) + "/" + path.basename(file3);

                    // reading each json and if it qualifies, we add it to var packages[]
                    let rawdata = fs.readFileSync(jsonPath);
                    let jsondata = JSON.parse(rawdata);

                    console.log(jsondata.description);
                }

            });
        });

    });
}

function display() {
    console.log("0. Έξοδος");
    console.log("1. Προβολή εγκατεστημένων πακέτων");
    console.log("2. Προσθήκη πακέτων");
    console.log("3. Αφαίρεση πακέτων");
    console.log("4. Εκκίνηση web server");
}

function menu() {
    var choice;
    do {
        display();
        choice = prompt();
        switch (choice) {
            case 0:
                // Έξοδος
                break;
            case 1:
                // Προβολή εγκατεστημένων πακέτων
                printAllApps();
                break;
            case 2:
                // Προσθήκη πακέτων
                // ...add
                merge_package_json();
                break;
            case 3:
                // Αφαίρεση πακέτων
                // ...remove
                merge_package_json();
                break;
            case 4:
                // Εκκίνηση web server
                break;
            default:
                // Λάθος είσοδος
                console.log("Λάθος λειτουργία, πληκτρολογήστε έναν αριθμό από 0-4.")
        }
    } while (choice != 0);
}

menu();