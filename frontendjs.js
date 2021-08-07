//const { packages } = require(".")
var apptabs = 5;
var webapps = [
    path = '.',
    tabs = {
        // "Δημοτικό": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
        // "Γυμνάσιο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
        // "Λύκειο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234']
    },
    packages = {
        // '8521-1234': {
        //     "description": "πληροφορική γυμνασίου",
        //     "name": "8521-1234"
        // },
        // '8521-1235': {
        //     "description": "πληροφορική γυμνασίου",
        //     "name": "8521-1234"
        // }
    },
    packageIndex = {
        // '8521-1234': 0,
        // '8521-1235': 1,
    }
];

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById('mySidebar').style.width = '250px'
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById('mySidebar').style.width = '0'
    document.getElementById('container').style.marginLeft = '0'
}

function makePackages() {
    // READ HTML: path, categories, apps
    var txt = document.getElementById('app-container').textContent.trim();
    var txtSplit = txt.split(',');

    webapps[0] = txtSplit[0].split(':')[1].trim();

    // update "webapps" variable that holds info about each category and its corresponding apps.
    for (i = 1; i < txtSplit.length; i++) {
        var catName = txtSplit[i].split(':')[0].trim();
        var catApps = txtSplit[i].split(':')[1].trim().split(' ');
        webapps[1][catName] = catApps;
        // make list with all apps and later keep json index of them
        for (app in catApps) {
            if (!webapps[3].hasOwnProperty(catApps[app])) {
                webapps[3][catApps[app]] = '';
            }
        }

    }
    loadCategories();

    // package.JS APP READ -> webapps.packages var update
    for (app in webapps[3]) {
        var script = document.createElement('script');
        script.src = sformat(webapps[0] + '{}/package.js', app);
        script.name = app;
        document.body.appendChild(script);
        script.onload = function() {
            webapps[2][this.name] = package;
            // After all scripts are loaded, load all apps to html (active category == "all")
            if (Object.keys(webapps[3]).length == Object.keys(webapps[2]).length) {
                onScriptsLoaded("Όλα");
            }
        };
    }
}

function ge(element) {
    return document.getElementById(element);
}

function loadCategories() {
    const ih = [];
    for (cat in webapps[1]) {
        ih.push(sformat('<a href="#" onclick="newCategory(this)">{}</a>', cat));
    }
    ge('categories').innerHTML += ih.join('\n');
    console.log(ge('num').innerText)
    ge('num').innerText = apptabs;
}

function onScriptsLoaded(activeCategory) {
    const ih = [];
    var collection;

    if (activeCategory == "Όλα") {
        collection = Object.keys(webapps[2]);
    } else {
        collection = webapps[1][activeCategory];
    }
    //console.log(collection)
    for (const app of collection) {
        //console.log(app)
        //console.log(webapps[2]);
        ih.push(sformat('<div class="app"><a href="{}/index.html"><div class="image-container"><div class="overlay"><div class="start-icon"></div><div class="click-start">Click to start</div></div><img class="app-image" src="{}/package.png"></div><div class="app-title">{}</div></a></div>', webapps[0] + app, webapps[0] + app, webapps[2][app].description));
    }
    //><div class="app-image"><img src="{}/package.png"></div>
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
    console.log(document.querySelector('.active-category').innerHTML)

    // clean apps and load new ones
    document.getElementById('app-container').innerHTML = ''
    onScriptsLoaded(newcategory.innerHTML);
}

// 0: minus, 1: plus
function changeTabs(sign) {
    apptabs += (-1) ** sign
    console.log(apptabs)
    ge('num').innerText = apptabs;
}