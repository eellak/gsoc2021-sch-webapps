function merge_package_json() {
    let packages = [];

    const fs = require('fs');
    const path = require('path')
    const folderPath = '../collection/node_modules/';

    console.log(fs.existsSync(folderPath));
    fs.readdirSync(folderPath).forEach(file => {
        fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
            fs.readdirSync(folderPath + path.basename(file) + "/" + path.basename(file2)).forEach(file3 => {
                if (file3 == "package.json") {
                    let jsonPath = folderPath + path.basename(file) + "/" + path.basename(file2) + "/" + path.basename(file3);

                    // reading each json and if it qualifies, we add it to var packages[]
                    let rawdata = fs.readFileSync(jsonPath);
                    let jsondata = JSON.parse(rawdata);
                    let keyword = false;
                    if (jsondata.keywords.hasOwnProperty("photodentro")) {
                        console.log("YEY");
                    }
                    for (i = 0; i < jsondata.keywords.length; i++) {
                        console.log(jsondata.keywords[i]);
                        if (jsondata.keywords[i] == "photodentro" || jsondata.keywords[i] == "ts.sch.gr")
                            keyword = true;
                        break;
                    }
                    let desc = jsondata.hasOwnProperty('description') &&
                        jsondata.description[0] != "" &&
                        jsondata.hasOwnProperty('thumbnails') &&
                        jsondata.thumbnails[0] != "";

                    if (keyword && desc) {
                        // json qualifies
                        packages.push(jsondata);
                    }

                }

            });
        });

    });

    // exports.packages = packages;
    console.log(packages.length);
    var superString = 'packages = [';
    for (i = 0; i < packages.length - 1; i++) {
        superString += JSON.stringify(packages[i]) + ', ';
    }
    superString += JSON.stringify(packages[packages.length - 1]) + ']';
    fs.writeFileSync('package-merged.js', superString);
}
merge_package_json();