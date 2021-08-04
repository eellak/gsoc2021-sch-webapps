#!/usr/bin/env node

var path = require('path');
var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function download(url, callback) {
  var data = [];
  http.get(url, function (res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      res.on('data', function (data_) {
        data.push(data_);
      });
      res.on('end', function () {
        callback(Buffer.concat(data));
      });
    }
  });
}

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

parser.on('error', function (err) { console.log('Parser error', err); });

function onXMLDownloaded(data) {
  parser.parseString(data, function (err, result) {
    makeFiles(result);
  });
}

function makeFiles(result) {
  var packageName = // 10761
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].header[0].identifier[0]).split('/')[1].split('"')[0];

  var otherNumber = // 8521
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].header[0].identifier[0]).split('/')[0].split('lor:')[1];

  var description = // 'Δραστηριότητα πρακτικής και εξάσκησης με στόχο ...'
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].description[0].string[0]['_']).replace(/"/g, '').replace(/\\r/g, '').replace(/\\n/g, '\n');

  var title = // Αναγνώριση και αναπαραγωγή μοτίβου
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].title[0].string[0]['_']).replace(/"/g, '');

  var image = JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].relation[1].resource[0].identifier[0].entry[0]).replace(/"/g, '');

  var keywords = [];
  var kwPath = result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].keyword;
  for (var kw in kwPath) {
    keywords.push(JSON.stringify(kwPath[kw].string[0]['_']).replace(/"/g, ''));
  }

  var homepage = 'http://photodentro.edu.gr/lor/r/' + otherNumber + '/' + packageName;
  var downloadLink = JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].technical[0].location['0']).replace(/"/g, '');

  // get json template
  var appDir = path.dirname(require.main.filename);
  var rawdata = fs.readFileSync(appDir + '/app-template.json');
  var jsonTemplate = JSON.parse(rawdata);

  jsonTemplate.description = title;
  jsonTemplate.descriptionLong = description;
  jsonTemplate.homepage = homepage;
  jsonTemplate.name = '@ts.sch.gr/l' + packageName;
  jsonTemplate.keywords = keywords;
  jsonTemplate.repository = downloadLink;

  // All these can run asynchronously, no need to chain them with callbacks

  writeFileIfNotExists('package.json', JSON.stringify(jsonTemplate, null, 4) + '\n');
  writeFileIfNotExists('package.js', 'package =\n' + JSON.stringify(jsonTemplate, null, 4) + '\n');

  // MAKE README
  var readme =
    '[![Μικρογραφία](' + image + ')](' + homepage + ')'
    + '\n\n**ΤΙΤΛΟΣ:** ' + title
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΑΝΑΦΟΡΑΣ:** ' + homepage
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΦΥΣΙΚΟΥ ΠΟΡΟΥ:** http://photodentro.edu.gr/v/item/ds/' + otherNumber + '/' + packageName
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΛΗΨΗΣ:** ' + downloadLink
    + '\n\n**ΛΕΞΕΙΣ ΚΛΕΙΔΙΑ:** ' + keywords.join(', ')
    + '\n\n**ΠΕΡΙΓΡΑΦΗ:** ' + description + '\n';

  writeFileIfNotExists('README.md', readme);

  // DOWNLOAD IMAGE
  download(image, function (data) {
    writeFileIfNotExists('package.png', data);
  });
}

// find xml url
//var initurl = process.argv[2].split('/r/')[1];
//var initurl = process.argv[2].substring(1);
var xmlurl = 'http://photodentro.edu.gr/oai-lor/request?verb=GetRecord&identifier=oai:photodentro:lor:8521/' + process.argv[2] + '&metadataPrefix=oai_lom';
// parse xml
download(xmlurl, onXMLDownloaded);
