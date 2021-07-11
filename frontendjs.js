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
  console.log(appContainer.childNodes)

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
  clickStart.textContent = 'Click to start'

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
    tmp0 = packages[i].homepage
    tmp1 = tmp0.split('/')
    tmp2 = tmp1[4].split('#')[0]
    url = 'https://photodentro.github.io/' + tmp2 + '/'
    console.log(url)
    img = url + 'package/256x144.png'
    console.log(img)

    buildApp(description, url, img)
  }
  document.getElementById('demo-app').style.display = "none"
}
