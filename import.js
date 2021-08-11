#!/usr/bin/env node

var path = require('path');
var http = require('http');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var app = {};

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
    if (err) {
      if (err.code === 'EEXIST') {
        // This just means the file already existed.
        // We will not treat that as an error, so kill the error code
        err = null;
        console.log('Not overwriting existing file:', fname);
      }
      else {
        // E.g. permission errors
        console.log('Error while writing file:', fname);
        throw err;
      }
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

function onHTMLDownloaded(data) {
  app.html = data.toString();
  download(app.urls.xml, onXMLDownloaded);
}

function onXMLDownloaded(data) {
  parser.parseString(data, function (err, xml) {
    app.xml = xml;
    processApp();
  });
}

function processApp() {
  var lom0 = app.xml['OAI-PMH'].GetRecord[0].record[0].metadata[0].lom[0];

  app.description = // 'Δραστηριότητα πρακτικής και εξάσκησης με στόχο ...'
    JSON.stringify(lom0.general[0].description[0].string[0]['_']).replace(/"/g, '').replace(/\\r/g, '').replace(/\\n/g, '\n');

  app.title = // Αναγνώριση και αναπαραγωγή μοτίβου
    JSON.stringify(lom0.general[0].title[0].string[0]['_']).replace(/"/g, '');

  // Some apps have only a small icon, some additionally have a big icon
  // The big icon doesn't appear in the xml; scrape the html page for it
  // To get it from the XML, we'd do:
  // app.icon = JSON.stringify(lom0.relation[1].resource[0].identifier[0].entry[0]).replace(/"/g, '');

  app.icon = 'http://photodentro.edu.gr' + app.html.match(/<img src="([^"]*)" alt="Εικονίδιο"/)[1]

  app.keywords = [];
  var kwPath = lom0.general[0].keyword;
  for (var kw in kwPath) {
    app.keywords.push(JSON.stringify(kwPath[kw].string[0]['_']).replace(/"/g, ''));
  }

  app.downloadLink = JSON.stringify(lom0.technical[0].location['0']).replace(/"/g, '');

  // get json template
  var rawdata = fs.readFileSync(path.join(__dirname, 'import-package.json'));
  var jsonTemplate = JSON.parse(rawdata);

  jsonTemplate.description = app.title;
  jsonTemplate.descriptionLong = app.description;
  jsonTemplate.homepage = app.urls.shownat;
  jsonTemplate.name = app.id[0] + '-' + app.id[1];
  jsonTemplate.keywords = app.keywords;
  jsonTemplate.repository = app.downloadLink;

  // All these can run asynchronously, no need to chain them with callbacks

  writeFileIfNotExists('package.json', JSON.stringify(jsonTemplate, null, 4) + '\n');
  writeFileIfNotExists('package.js', 'package =\n' + JSON.stringify(jsonTemplate, null, 4) + '\n');

  // Create README.md
  var readme =
    '[![Εικονίδιο](' + app.icon + ')](' + app.urls.shownat + ')'
    + '\n\n**ΤΙΤΛΟΣ:** ' + app.title
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΑΝΑΦΟΡΑΣ:** ' + app.urls.shownat
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΦΥΣΙΚΟΥ ΠΟΡΟΥ:** ' + app.urls.preview
    + '\n\n**ΔΙΕΥΘΥΝΣΗ ΛΗΨΗΣ:** ' + app.downloadLink
    + '\n\n**ΛΕΞΕΙΣ ΚΛΕΙΔΙΑ:** ' + app.keywords.join(', ')
    + '\n\n**ΠΕΡΙΓΡΑΦΗ:** ' + app.description + '\n';

  writeFileIfNotExists('README.md', readme);

  download(app.icon, function (data) {
    writeFileIfNotExists('package.jpg', data);
  });
}

function urls(id) {
  var result = {};
  // Check possible types at http://photodentro.edu.gr/aggregator/
  switch (id[0]) {
    case '8521':
      result.xml = 'http://photodentro.edu.gr/oai-lor/request?verb=GetRecord&identifier=oai:photodentro:lor:{1}/{2}&metadataPrefix=oai_lom';
      result.shownat = 'http://photodentro.edu.gr/lor/r/{1}/{2}';
      result.preview = 'http://photodentro.edu.gr/v/item/ds/{1}/{2}';
      break;
    case '8522':
      result.xml = 'http://photodentro.edu.gr/oai-video/request?verb=GetRecord&identifier=oai:photodentro:educationalvideo:{1}/{2}&metadataPrefix=oai_lom';
      result.shownat = 'http://photodentro.edu.gr/video/r/{1}/{2}';
      result.preview = 'http://photodentro.edu.gr/v/item/video/{1}/{2}';
      break;
    case '8525':
      result.xml = 'http://photodentro.edu.gr/oai-ugc/request?verb=GetRecord&identifier=oai:photodentro:ugc:{1}/{2}&metadataPrefix=oai_lom';
      result.shownat = 'http://photodentro.edu.gr/ugc/r/{1}/{2}';
      result.preview = 'http://photodentro.edu.gr/v/item/ugc/{1}/{2}';
      break;
    case '8531':
      result.xml = 'http://photodentro.edu.gr/oai-edusoft/request?verb=GetRecord&identifier=oai:photodentro:edusoft:{1}/{2}&metadataPrefix=oai_lom';
      result.shownat = 'http://photodentro.edu.gr/edusoft/r/{1}/{2}';
      result.preview = 'http://photodentro.edu.gr/v/item/edusoft/{1}/{2}';
      break;
    default: throw new Error('Invalid app id: ' + app.id);
  }
  result.xml = result.xml.replace('{1}', id[0]).replace('{2}', id[1])
  result.shownat = result.shownat.replace('{1}', id[0]).replace('{2}', id[1])
  result.preview = result.preview.replace('{1}', id[0]).replace('{2}', id[1])

  return result;
}

// Convert string 'id0-id1' to an array ['id0', 'id1']
app.id = process.argv[2].replace('-', '/').split('/');
app.urls = urls(app.id);
download(app.urls.shownat, onHTMLDownloaded);
