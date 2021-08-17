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
const { networkInterfaces } = require('os');

function writeFileIfNotExists(name, data) {
  if (!fs.existsSync(name)) {
    fs.writeFileSync(name, data, function (err) {
      if (err) throw err;
    });
  }
}

function merge_package_json() {
  let packages = [];
  let i;

  const folderPath = 'node_modules/';

  fs.readdirSync(folderPath).forEach(file => {
    fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
      if (file2 == 'package.json') {
        let jsonPath = folderPath + path.basename(file) + '/' + path.basename(file2);

        // reading each json and if it qualifies, we add it to var packages[]
        let rawdata = fs.readFileSync(jsonPath);
        let jsondata = JSON.parse(rawdata);
        let keyword = false;
        if (jsondata.hasOwnProperty('keywords')) {
          // for (i = 0; i < jsondata.keywords.length; i++) {
          //   if (jsondata.keywords[i] == 'photodentro' || jsondata.keywords[i] == 'ts.sch.gr') {
          keyword = true;
          //     break;
          //   }
          // }
        }

        let desc = jsondata.hasOwnProperty('description') &&
          jsondata.description[0] != '' &&
          jsondata.hasOwnProperty('icon') &&
          jsondata.icon[0] != '';

        if (keyword && desc) {
          // json qualifies
          packages.push(jsondata);
          console.log('   - Στη λίστα: ' + jsondata.description);
        }
      }
    });
  });

  //exports.packages = packages;
  console.log('Συνολικές εφαρμογές στη λίστα: ' + packages.length);
  var superString = '';
  for (i = 0; i < packages.length - 1; i++) {
    superString += JSON.stringify(packages[i], null, 4) + ', ';
  }
  superString += JSON.stringify(packages[packages.length - 1], null, 4);
  console.log(superString);
  superString = 'packages = [\n' + superString + '\n]\n';
  
  fs.writeFileSync('package-merged.js', superString);
}

function printAllApps() {
  let packages = [];

  const folderPath = 'node_modules/';

  console.log('Βρέθηκαν οι ακόλουθες ιστοεφαρμογές:');
  fs.readdirSync(folderPath).forEach(file => {
    fs.readdirSync(folderPath + path.basename(file)).forEach(file2 => {
      if (file2 == 'package.json') {
        let jsonPath = folderPath + path.basename(file) + '/' + path.basename(file2);

        let rawdata = fs.readFileSync(jsonPath);
        let jsondata = JSON.parse(rawdata);

        let desc = jsondata.hasOwnProperty('description') &&
          jsondata.description != '' &&
          jsondata.hasOwnProperty('icon') &&
          jsondata.icon != '';

        if (desc) {
          // json qualifies
          console.log('   - ' + path.basename(file) + ': ' + jsondata.description);
        }
      }
    });

  });
}

function display() {
  console.log(' ~~ ΜΕΝΟΥ ΕΠΙΛΟΓΩΝ ~~ ');
  console.log('0. Έξοδος');
  console.log('1. Προβολή εγκατεστημένων ιστοεφαρμογών');
  console.log('2. Εγκατάσταση ιστοεφαρμογών');
  console.log('3. Απεγκατάσταση ιστοεφαρμογών');
  console.log('4. Εκκίνηση web server');
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
  return '0.0.0.0';
}

function startServer() {
  var dir = process.cwd();

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
    rl.question('Πατήστε ENTER για τερματισμό του webserver ', (input) => {
      if (input == "") {
        // stop webserver
        server.close();
        menu();
      }
    });
  });
}

function menu() {
  display()

  rl.question('Πληκτρoλογήστε την επιλογή σας (0-4): ', (choice) => {

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
        rl.question('Πληκτρολογήστε τα αναγνωριστικά των ιστοεφαρμογών: ', (newApps) => {
          add(newApps);
          merge_package_json();
          menu();
        });
        return;
      case '3':
        // Αφαίρεση πακέτων
        rl.question('Πληκτρολογήστε τα αναγνωριστικά των ιστοεφαρμογών: ', (oldApps) => {
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
        console.log('Λάθος λειτουργία, πληκτρολογήστε έναν αριθμό από 0-4.')
    }
    menu();
  });
}

function parseArgs(args) {
  switch (args[0]) {
    case 'ls':
      printAllApps();
      break;
    case 'i':
    case 'install':
      add(args.slice(1).join(' '));
      break;
    case 'remove':
    case 'rm':
    case 'uninstall':
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
  var json = `{
  "description": "Ιδιωτική συλλογή",
  "license": "CC-BY-SA-4.0",
  "version": "1.0.0",
  "repository": " "
}
`;
  writeFileIfNotExists('package.json', json);
  writeFileIfNotExists('package-lock.json', `{
  "version": "1.0.0",
  "lockfileVersion": 1
}
`);

  if (!fs.existsSync('node_modules/sch-webapps')) {
    spawnSync('npm install --registry=https://ts.sch.gr/npm/ sch-webapps', { stdio: 'inherit', shell: true });
  }
  // 3) ftiaxe kai ena template index.html
  fs.copyFile('node_modules/sch-webapps/index.html', 'index.html', (err) => {
    if (err) throw err;
  });

  var args = process.argv.slice(2);
  if (args.length > 0) {
    parseArgs(args);
  } else
    menu();
}

init();
