// process.argv is an array containing the command line arguments. 
// The first element will be 'node', the second element will be the 
// name of the JavaScript file. The next elements will be any 
// additional command line arguments.

// process.argv.forEach(function(val, index, array) {
//     console.log(index + ': ' + val);
// });

let url = process.argv[2];

// installed "npm install fast-xml-parser"
var parser = require('fast-xml-parser');
var eyes = require('eyes');
var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

parser.on('error', function(err) { console.log('Parser error', err); });

function getXML() {
    var data = '';
    http.get(url, function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
            res.on('data', function(data_) { data += data_.toString(); });
            res.on('end', function() {
                //console.log('data', data);
                parser.parseString(data, function(err, result) {
                    // console.log('FINISHED', JSON.stringify(result));
                    makeJSON(result);
                });
            });
        }
    });
}

function makeJSON(result) {
    var packageName = // l10772
        JSON.stringify(result["OAI-PMH"].GetRecord[0].record[0].header[0].identifier[0]).split('/')[1].split('"')[0];

    var otherNumber =
        JSON.stringify(result["OAI-PMH"].GetRecord[0].record[0].header[0].identifier[0]).split('/')[0].split('lor:')[1];

    var description = // "Δημιουργώ τροφικές αλυσίδες"
        JSON.stringify(result["OAI-PMH"].GetRecord[0].record[0].metadata[0].lom[0].general[0].description[0].string[0]['_']).replace('"', '');

    var title = // foodchain
        JSON.stringify(result["OAI-PMH"].GetRecord[0].record[0].metadata[0].lom[0].general[0].title[0].string[0]['_']).replace('"', '');

    //console.log(title);

    // get json template
    let rawdata = fs.readFileSync('app-template.json');
    let jsonTemplate = JSON.parse(rawdata);

    // console.log("\n\n" + JSON.stringify(jsonTemplate));
    jsonTemplate.bugs.url = "https://github.com/photodentro/" + title;
    jsonTemplate.description = description;
    jsonTemplate.homepage = "http://photodentro.edu.gr/lor/r/" + otherNumber + "/" + packageName;
    jsonTemplate.name = "@ts.sch.gr/" + packageName;
    jsonTemplate.repository.url = "git+https://github.com/photodentro/" + title + ".git";
    console.log(JSON.stringify(jsonTemplate));

}

getXML();