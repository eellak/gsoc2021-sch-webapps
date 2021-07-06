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
function loadApps() { // args: appTitle, appURL, appImg
    var app_container = document.getElementById('app-container')
    console.log(app_container.childNodes)

    var app = document.createElement('div')
    app.classList.add('app')

    var a = document.createElement('a')
    a.href = ''
    a.target = '_blank'

    var image_container = document.createElement('div')
    image_container.classList.add('image-container')

    var overlay = document.createElement('div')
    overlay.classList.add('overlay')

    var start_icon = document.createElement('div')
    start_icon.classList.add('start-icon')

    var click_start = document.createElement('div')
    click_start.classList.add('click-start')
    click_start.textContent = 'Click to start'

    overlay.appendChild(start_icon)
    overlay.appendChild(click_start)

    var app_image = document.createElement('div')
    app_image.classList.add('app-image')
    app_image.style.backgroundImage = 'url(./imgs/256x144.png)'

    image_container.appendChild(overlay)
    image_container.appendChild(app_image)

    var app_title = document.createElement('div')
    app_title.classList.add('app-title')
    app_title.textContent = 'Σβήσιμο οθόνης με σύρσιμο του ποντικιού'

    a.appendChild(image_container)
    a.appendChild(app_title)

    app.appendChild(a)
    app_container.appendChild(app)
}