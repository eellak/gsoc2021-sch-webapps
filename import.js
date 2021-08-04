#!/usr/bin/env node

var path = require('path');
var appDir = path.dirname(require.main.filename);

var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var download = function (url, callback) {
  var data = [];
  http.get(url, function (res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      res.on('data', function (data_) {
        data.push(data_);
      });
      res.on('end', function () {
        //console.log('data', data);
        callback(Buffer.concat(data));
      });
    }
  });
};

fs.writeFileIfNotExist = function (fname, contents, options, callback) {
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
      // This just means the file already existed.  We
      // will not treat that as an error, so kill the error code
      err = null;
      existed = true;
    }
    if (typeof callback === 'function') {
      callback(err, existed);
    }
  });
}

parser.on('error', function (err) { console.log('Parser error', err); });

function onXMLDownloaded(data) {
  parser.parseString(data, function (err, result) {
    //console.log('FINISHED', JSON.stringify(result));
    makeFiles(result);
  });
}

function makeFiles(result) {
  var packageName = // l10772
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].header[0].identifier[0]).split('/')[1].split('"')[0];

  var otherNumber =
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].header[0].identifier[0]).split('/')[0].split('lor:')[1];

  var description = // 'Δημιουργώ τροφικές αλυσίδες'
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].description[0].string[0]['_']).replace(/"/g, '').replace(/\\r/g, '').replace(/\\n/g, '\n');

  var title = // foodchain
    JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].title[0].string[0]['_']).replace('"', '');

  var image = JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].relation[1].resource[0].identifier[0].entry[0]).replace(/"/g, '');

  var keywords = [];
  var kwPath = result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].general[0].keyword;
  for (var kw in kwPath) {
    keywords.push(JSON.stringify(kwPath[kw].string[0]['_']).replace(/"/g, ''));
  }

  var homepage = 'http://photodentro.edu.gr/lor/r/' + otherNumber + '/' + packageName;
  var downloadLink = JSON.stringify(result['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0].technical[0].location['0']).replace(/"/g, '');

  // get json template
  let rawdata = fs.readFileSync(appDir + '/app-template.json');
  let jsonTemplate = JSON.parse(rawdata);

  // console.log('\n\n' + JSON.stringify(jsonTemplate));
  jsonTemplate.description = description;
  jsonTemplate.homepage = homepage;
  jsonTemplate.name = '@ts.sch.gr/l' + packageName;
  jsonTemplate.keywords = keywords;
  jsonTemplate.repository = downloadLink;
  //console.log(JSON.stringify(jsonTemplate));

  fs.writeFileIfNotExist('package.json', JSON.stringify(jsonTemplate, null, 4) + '\n', function (err, existed) {
    if (err) {
      // error here
    } else if (existed) {
      // data was written or file already existed
      // existed flag tells you which case it was
      console.log('package.json already existed, nothing happened');
    } else {
      console.log('package.json created');
      fs.writeFile('package.js', 'package =\n' + JSON.stringify(jsonTemplate, null, 4) + '\n', function (err, existed) { });
    }
  });

  // MAKE README
  var readme =
    '[![Μικρογραφία](' + image + ')](' + homepage + ')'
    + '\n\n**ΤΙΤΛΟΣ:** ' + title + '\n\n**ΔΙΕΥΘΥΝΣΗ ΑΝΑΦΟΡΑΣ:** ' + homepage
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΦΥΣΙΚΟΥ ΠΟΡΟΥ:** http://photodentro.edu.gr/v/item/ds/' + otherNumber + '/' + packageName
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΛΗΨΗΣ:** ' + downloadLink
    + '\n\n**KEYWORDS:** ' + keywords + '\n\n**ΠΕΡΙΓΡΑΦΗ:** ' + description + '\n';

  //console.log(readme);
  fs.writeFileIfNotExist('README.md', readme, function (err, existed) {
    if (err) {
      // error here
    } else if (existed) {
      // data was written or file already existed
      // existed flag tells you which case it was
      console.log('README.md already existed, nothing happened');
    } else {
      console.log('README.md created');
    }
  });

  // DOWNLOAD IMAGE
  download(image, function (data) {
    fs.writeFileSync('package.png', data);
    console.log('Package image downloaded');
  });
}

// find xml url
//var initurl = process.argv[2].split('/r/')[1];
//var initurl = process.argv[2].substring(1);
var xmlurl = 'http://photodentro.edu.gr/oai-lor/request?verb=GetRecord&identifier=oai:photodentro:lor:8521/' + process.argv[2] + '&metadataPrefix=oai_lom';
// parse xml
download(xmlurl, onXMLDownloaded);
