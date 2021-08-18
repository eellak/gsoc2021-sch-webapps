
var appCounter = 0;
var columnSize = 18;
var webapps = {
  path: '.',
  tabs: {
    // "Δημοτικό": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
    // "Γυμνάσιο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
    // "Λύκειο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234']
  },
  pckgs: {
    // '8521-1234': {
    //     "description": "πληροφορική γυμνασίου",
    //     "name": "8521-1234"
    // },
    // '8521-1235': {
    //     "description": "πληροφορική γυμνασίου",
    //     "name": "8521-1234"
    // }
  },
  packageIndex: {
    // 0: '8521-1234',
    // 1: '8521-1235',
  }
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById('mySidebar').style.width = '250px'
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById('mySidebar').style.width = '0'
  document.getElementById('sch-webapps').style.marginLeft = '0'
}

function makePackages() {
  // READ HTML: path, categories, apps
  var txt = document.getElementById('app-container').innerText.trim();
  webapps.path = 'node_modules/';
  if (txt != '') {
    var txtSplit = txt.split(',');

    var path = txtSplit[0].split(':')[1].trim();
    if (path != '')
      webapps.path = path;

    // update "webapps" variable that holds info about each category and its corresponding apps.
    for (var i = 1; i < txtSplit.length; i++) {
      var catName = txtSplit[i].split(':')[0].trim();
      var catApps = txtSplit[i].split(':')[1].trim().split(' ');
      webapps.tabs[catName] = catApps;
      // make list with all apps and later keep json index of them
      for (let app in catApps) {
        if (!Object.values(webapps.packageIndex).includes(catApps[app])) {
          webapps.packageIndex[appCounter++] = catApps[app];
        }
      }
    }
  }


  // now check for other apps in package-merged to add on the list
  if (packages != undefined) {
    for (let app of packages) {
      if (!Object.values(webapps.packageIndex).includes(app.name)) {
        webapps.packageIndex[appCounter++] = app.name;
      }
    }
  }

  loadCategories();

  // package.JS APP READ -> webapps.packages var update
  for (let counter in webapps.packageIndex) {
    let app = webapps.packageIndex[counter];
    var script = document.createElement('script');
    script.src = sformat(webapps.path + '{}/package.js', app);
    script.name = app;
    document.body.appendChild(script);
    script.onload = function () {
      // eslint-disable-next-line no-undef
      webapps.pckgs[this.name] = package;
      // After all scripts are loaded, load all apps to html (active category == "all")
      if (Object.keys(webapps.packageIndex).length == Object.keys(webapps.pckgs).length) {
        onScriptsLoaded('Όλα');
      }
    };
  }
}

function ge(element) {
  return document.getElementById(element);
}

function loadCategories() {
  const ih = [];
  for (let cat in webapps.pckgs) {
    ih.push(sformat('<a href="#" onclick="newCategory(this)">{}</a>', cat));
  }
  ge('categories').innerHTML += ih.join('\n');
  ge('num').innerText = columnSize;
}

function onScriptsLoaded(activeCategory) {
  const ih = [];
  var collection;

  if (activeCategory == 'Όλα') {
    collection = Object.keys(webapps.pckgs);
  } else {
    collection = webapps.tabs[activeCategory];
  }
  for (var i = 0; i < Object.keys(webapps.packageIndex).length; i++) {
    var app = webapps.packageIndex[i];
    if (collection.includes(app)) {
      ih.push(sformat('<div class="app"><a href="{}/index.html"><div class="image-container"><div class="overlay"><div class="start-icon"></div><div class="click-start">Εκκίνηση</div></div><img class="app-image" src="{}/{}"></div><div class="app-title">{}</div></a></div>', webapps.path + app, webapps.path + app, webapps.pckgs[app].icon, webapps.pckgs[app].description));
    }
  }
  ge('app-container').innerHTML = ih.join('\n');
}

// ES6 string templates don't work in old Android WebView
function sformat(format) {
  const args = arguments;
  var i = 0;
  return format.replace(/{(\d*)}/g, function sformatReplace(match, number) {
    i += 1;
    if (typeof args[number] !== 'undefined') {
      return args[number];
    }
    if (typeof args[i] !== 'undefined') {
      return args[i];
    }
    return match;
  });
}

function newCategory(newcategory) {
  // change side menu active category
  document.querySelector('.active-category').classList.remove('active-category')
  newcategory.classList.add('active-category')

  // clean apps and load new ones
  document.getElementById('app-container').innerHTML = ''
  onScriptsLoaded(newcategory.innerHTML);
}

// 0: minus, 1: plus
function changeColumns(sign) {
  columnSize += Math.pow(-1, sign)
  if (columnSize < 5)
    columnSize = 5;
  if (columnSize > 23)
    columnSize = 23;
  ge('num').innerText = columnSize;
  document.querySelector(':root').style.setProperty('--colwidth', parseInt(columnSize) + 'em');
}

function init() {
  var cssId = 'styles';
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.id = cssId;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'node_modules/sch-webapps/style.css';
  link.media = 'all';
  head.appendChild(link);

  if (window.addEventListener) {
    window.addEventListener('load', makeHtml)
    //window.addEventListener('load', makePackages)
  } else {
    window.attachEvent('onload', makeHtml)
    //window.attachEvent('onload', makePackages)
  }
}

function makeHtml() {
  var col = ge('sch-webapps').innerHTML;
  ge('sch-webapps').innerHTML = `
        <div class="top-bar">
            <div class="hamburger" onclick="openNav()"></div>
            <a href="index.html" id="site-title">Συλλογή εκπαιδευτικών ιστοεφαρμογών</a>
        </div>
        <div id="mySidebar" class="side-menu">
            <div id="categories">
                <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
                <a href="#" onclick="newCategory(this)" class="active-category">Όλα</a>
            </div>

            <div id="options">
                Μέγεθος
                <div>
                    <div id="minus" onclick="changeColumns(1)"></div>
                    <div id="num">num</div>
                    <div id="plus" onclick="changeColumns(2)"></div>
                </div>
                <a href="https://gitlab.com/ts.sch.gr/sch-webapps" id="ref">By sch-webapps</a>
            </div>
        </div>
        <div id="app-container">
        </div>`;

  ge('app-container').innerHTML = col;
  makePackages();
}

init();
