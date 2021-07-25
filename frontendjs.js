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
function buildApp(appDescription, appURL, appImg) {
    var appContainer = document.getElementById('app-container')

    var app = document.createElement('div')
    app.classList.add('app')

    var a = document.createElement('a')
    a.href = appURL
    a.target = '_blank'

    var imageContainer = document.createElement('div')
    imageContainer.classList.add('image-container')

    var overlay = document.createElement('div')
    overlay.classList.add('overlay')

    var startIcon = document.createElement('div')
    startIcon.classList.add('start-icon')

    var clickStart = document.createElement('div')
    clickStart.classList.add('click-start')
    clickStart.textContent = 'Ξεκίνα'

    overlay.appendChild(startIcon)
    overlay.appendChild(clickStart)

    var appImage = document.createElement('div')
    appImage.classList.add('app-image')
    appImage.style.backgroundImage = 'url(' + appImg + ')'

    imageContainer.appendChild(overlay)
    imageContainer.appendChild(appImage)

    var appTitle = document.createElement('div')
    appTitle.classList.add('app-title')
    appTitle.textContent = appDescription

    a.appendChild(imageContainer)
    a.appendChild(appTitle)

    app.appendChild(a)
    appContainer.appendChild(app)
}

function loadApps() {
    for (i = 0; i < packages.length; i++) {
        description = packages[i].description
        tmp0 = packages[i].name
        tmp1 = tmp0.split('/')[1]
        url = '../' + tmp1 + '/' + "index.html"
        img = url + 'package/256x144.png'

        buildApp(description, url, img)
    }
    document.getElementById('demo-app').style.display = "none"
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