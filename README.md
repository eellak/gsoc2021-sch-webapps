# sch-webapps

Collections of educational web applications.

## Introduction

Photodentro is the official repository of K12 educational material for Greece. It contains more than 15,000 learning objects or applications which are implemented in HTML, Adobe Flash, Java or other technologies, and it's used by thousands of students and teachers.
Unfortunately, it has the following limitations:

- Applications can't be operated offline, for example when Internet connectivity is an issue.
- There's no way for users to create their own collections, which would ease navigation.
- Finally, teachers should be able to expose their offline collections on the school LAN so that students would use them via any browser.


The development of sch-webapps application addresses these three limitations, hugely benefiting K12 education and possibly many others.

## Project description

Sch-webapps is a collection of applications and documentation that helps in downloading or sharing educational application collections, by using an npm repository.
For example, it's possible to download many apps from [Photodentro](http://photodentro.edu.gr) by pasting just their code-names or a collection name.

Sch-webapps consists of a front-end, developed in HTML5/CSS3/Javascript and a back-end developed in nodejs. An effort was made to keep the javascript library requirements as bare as possible in order to minimize the application size and download
time, but mostly to make it easier for teachers to maintain this application in the future.

It has the following functions:

- It functions as a static HTML site generator producing a folder structure suitable for browsing and viewing the collected educational applications locally, via any web browser.
- It allows teachers to create their own collections and define their own categories by pasting a list of educational application code-names.
- It automatically detects the downloaded npm applications that contains the project title/description etc, and the application.jpg thumbnail.
- It can also function as a web server, exposing the collection to the school LAN, allowing LAN students to browse the collection organized by categories and view the educational applications.
- It can download or remove apps and also display the apps downloaded.


Also, a developer's helper to automate npm packaging for educational apps has been implemented and it has the following functions:
- It receives as arguments the code-name of the app.
- It detects and downloads the XML data and extracts the valuable information.
- It publishes the app as npm package with a new README.md and a json file.

## Instructions

To use sch-webapps application, nodejs is necessary and needs to be downloaded separately.

- For Windows/macOS, download from [nodejs page](https://nodejs.org/en/download/).
- For Linux, use the command `sudo apt-get install npm`

After that, create an empty file for your collection (e.g. collection) and in that file start the sch-webapps as following:
 - For Windows: download [sch-webapps.bat](TODO) and move it inside the collection file. Then double-click it.
 - For Linux/macOS right click the collection file and select "Open in terminal". Then paste `npx sch-webapps`. (That step also works for Windows)

 Then, the following menu will appear. It is simple, yet efficient.
```shell
 ~~ ΜΕΝΟΥ ΕΠΙΛΟΓΩΝ ~~
0. Έξοδος
1. Προβολή εγκατεστημένων ιστοεφαρμογών
2. Εγκατάσταση ιστοεφαρμογών
3. Απεγκατάσταση ιστοεφαρμογών
4. Εκκίνηση web server
Πληκτρολόγησε την επιλογή σου (0-4): _
```

0. Exits the program

1. Displays the installed applications that constitute the collection

2. Downloads the applications that the user provided from the npm repository, for example:

    [8521-10760](http://photodentro.edu.gr/lor/r/8521/10760) [8521-10761](http://photodentro.edu.gr/lor/r/8521/10761) [8521-10762](http://photodentro.edu.gr/lor/r/8521/10762) [8521-10763](http://photodentro.edu.gr/lor/r/8521/10763)

Additionally, we can download a premade collection, for example by pasting the word `preschool`, 30 preschool applications will be downloaded.

3. Removes applications in the same way as above, by pasting the applications' code-names.

4. Starts a webserver to publish the collection to the local network. A message like the one following will appear:
    ```
   Διεύθυνση σύνδεσης στη συλλογή: http://192.168.1.123:7000
   Πατήστε Ctrl+C για τερματισμό του web server
   ```
Anyone at the school, from any device can type this address in the browser and see the teacher's collection **without the need to download nodejs**.

**After the collection is created, nodejs isn't necessary anymore to display it.**
You can, for example, zip the collection and share it with others. Then they can unzip it and display it with a double click in index.html. [Example collection](https://github.com/photodentro/preschool/archive/refs/heads/main.zip).

## Collection creation without nodejs

While it is easier to create a collection by following the instructions above, it is possible without the use of nodejs.
In that case, you have to manually download and unzip the applications and sch-webapps. You should have the following file structure:

- [index.html](https://gitlab.com/ts.sch.gr/sch-webapps/-/raw/main/index.html?inline=false)
- [sch-webapps](https://gitlab.com/ts.sch.gr/sch-webapps/-/archive/main/sch-webapps-main.tar.gz)
  - index.html, index.js, sch-webapps.js κλπ
- [8521-10760](https://ts.sch.gr/npm/-/web/detail/8521-10760)
  - index.html, package.jpg, package.js κλπ
- [8521-10761](https://ts.sch.gr/npm/-/web/detail/8521-10761)
  - index.html, package.jpg, package.js κλπ
- ...

Then, open index.html file with a text editor and write down your collection, one category per line, for example:

```
 Category1: webapp1 webapp2 ... webapp10
 Category2: webapp1 webapp12 ... webapp20
 ```

That's all! Now double-click index.html to open it. In a similar way the collection can be embedded in Wordpress or Joomla.

## For advanced users

It is possible to invoke the sch-webapps functions without using a menu. Specifically:

 - `npx sch-webapps ls`: display all downloaded applications.
- `npx sch-webapps install webapp1 webapp2 collection3`: multi-download applications.
- `npx sch-webapps uninstall webapp4 webapp5`: uninstall applications.
- `npx sch-webapps webserver`: start webserver to publish the collection in the local network.
- `npx sch-webapps index`: create package-merged.json (although it is created/updated automatically after every install/uninstall).
- `npx sch-webapps publish`: publish an application in npm repository (account required).
- `npx sch-webapps import 8521-10760`: import package.jpg and package.js from Photodentro, for automated packaging.
