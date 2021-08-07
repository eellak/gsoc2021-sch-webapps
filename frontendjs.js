//const { packages } = require(".")
var webapps = [
    path = '.',
    tabs = [
        // "Δημοτικό": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
        // "Γυμνάσιο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234'],
        // "Λύκειο": ['8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234', '8521-1234']
    ],
    packages = [
        // {
        //     "description": "πληροφορική γυμνασίου",
        //     "name": "8521-1234"
        // },
        // {
        //     "description": "πληροφορική γυμνασίου",
        //     "name": "8521-1234"
        // }
    ],
    packageIndex = {
        // '8521-1234': 0,
        // '8521-1235': 1,
    }
];

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById('mySidebar').style.width = '250px'
    document.getElementById('container').style.marginLeft = '250px'
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById('mySidebar').style.width = '0'
    document.getElementById('container').style.marginLeft = '0'
}

// load dynamically into container every app needed
// function buildApp(appDescription, appURL, appImg) {
//     var appContainer = document.getElementById('app-container')

//     var app = document.createElement('div')
//     app.classList.add('app')

//     var a = document.createElement('a')
//     a.href = appURL
//     a.target = '_blank'

//     var imageContainer = document.createElement('div')
//     imageContainer.classList.add('image-container')

//     var overlay = document.createElement('div')
//     overlay.classList.add('overlay')

//     var startIcon = document.createElement('div')
//     startIcon.classList.add('start-icon')

//     var clickStart = document.createElement('div')
//     clickStart.classList.add('click-start')
//     clickStart.textContent = 'Ξεκίνα'

//     overlay.appendChild(startIcon)
//     overlay.appendChild(clickStart)

//     var appImage = document.createElement('div')
//     appImage.classList.add('app-image')
//     appImage.style.backgroundImage = 'url(' + appImg + ')'

//     imageContainer.appendChild(overlay)
//     imageContainer.appendChild(appImage)

//     var appTitle = document.createElement('div')
//     appTitle.classList.add('app-title')
//     appTitle.textContent = appDescription

//     a.appendChild(imageContainer)
//     a.appendChild(appTitle)

//     app.appendChild(a)
//     appContainer.appendChild(app)
// }

function makePackages() {
    var categoryApps = [];

    // READ HTML: path, categories, apps
    var txt = document.getElementById('app-container').textContent.trim();
    var txtSplit = txt.split(',');

    webapps[0] = txtSplit[0].split(':')[1].trim();

    // update "webapps" variable that holds info about each category and its corresponding apps.
    for (i = 1; i < txtSplit.length; i++) {
        var catName = txtSplit[i].split(':')[0].trim();
        var catApps = txtSplit[i].split(':')[1].trim().split(' ');
        webapps[1].push({
            key: catName,
            value: catApps
        });
        //console.log(webapps[1]);
        // make list with all apps and later keep json index of them
        for (app in catApps) {
            if (!webapps[3].hasOwnProperty(catApps[app])) {
                webapps[3][catApps[app]] = '';
            }
        }

    }
    console.log(webapps[3]);

    // package.JS APP READ -> webapps.packages var update
    for (app in webapps[3]) {
        var script = document.createElement('script');
        script.src = sformat(webapps[0] + '{}/package.js', app);
        script.name = app;
        document.body.appendChild(script);
        //console.log(package.name);
        script.onload = function() {
            webapps[2][this.name] = package;
            // if (webapps[3].length == Object.keys(webapps).length) {
            //     onScriptsLoaded();
            // }
            onScriptsLoaded();
        };

    }
    console.log(webapps[2]);
    return categoryApps;
}

function ge(element) {
    return document.getElementById(element);
}

function onScriptsLoaded() {
    const ih = [];
    var wn;
    for (app in webapps[2]) {
        wn = app;
        ih.push(sformat('<div class="app"><a href="{}/index.html"><div class="image-container"><div class="overlay"><div class="start-icon"></div><div class="click-start">Click to start</div></div><img class="app-image" src="{}/package.png"></div><div class="app-title">{}</div></a></div>', webapps[0] + wn, webapps[0] + wn, webapps[2][app].description));
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

function loadApps() { //activeCategory
    packages = makePackages();
    // for (i = 0; i < packages.length; i++) {
    //     description = packages[i].description
    //     tmp0 = packages[i].name
    //     tmp1 = tmp0.split('/')[1]
    //     url = '../' + tmp1 + '/'
    //     img = url + 'package.png'

    //     buildApp(description, url + "index.html", img)
    // }
    // document.getElementById('demo-app').style.display = "none"
}

function newCategory(newcategory) {
    // change side menu active category
    document.querySelector('.active-category').classList.remove('active-category')
    newcategory.classList.add('active-category')
    console.log(document.querySelector('.active-category').innerHTML)

    // clean apps and load new ones
    document.getElementById('app-container').innerHTML = ''
    loadApps()
}