# Google Summer Of Code Application

GSoC application for the sch-webapps project ideaof the GFOSS organization

## Introduction

Photodentro is the official repository of K12 educational material for Greece. It contains more
than 15,000 learning objects or applications which are implemented in HTML, Adobe Flash,
Java or other technologies, and it's used by thousandsof students and teachers.
Unfortunately, it has the following limitations:

- Flash based applications (2,760) are no longer viewablesince Adobe deprecated
Flash at the end of 2020.
- Applications can't be operated offline, for example when Internet connectivity is an
issue.
- There's no way for users to create their own collections, which would ease
navigation.
- Finally, teachers should be able to expose their offlinecollections on the school LAN
so that students would use them viaany browser.


I propose the development of a new sch-webapps applicationthat will address these four
limitations, hugely benefiting K12 education and possibly many others.

## Project goals

Sch-webapps will consist of a front-end, developedin HTML5/CSS3/Javascript and a
back-end developed in nodejs. An effort will be madeto keep the javascript library
requirements as bare as possible in order to minimizethe application size and download
time, but mostly to make it easier for teachers tomaintain this application in the future.

The back-end has the following goals:
● It receives a list of educational application URLsfrom the teacher.
● It automatically detects and downloads the application.zip,the application.xml
metadata that contains the project title/descriptionetc, and the application.png
thumbnail.
● It functions as a static HTML site generator producinga folder structure suitable for
browsing and viewing the collected educational applicationslocally, via any web
browser.
● It can also function as a web server, exposing thecollection to theschool LAN.

The generated static HTML site is the front-end andit has the following goals:
● It allows local or LAN students and teachers to browsethe collection organized by
categories and view the educational applications.
● It allows the teacher to authenticate and enter anadministrative interface.
● The administrative interface allows for adding orremoving educational apps.

Documentation will also be provided for downloading,installing and using the sch-webapps
aggregator.

## Timeline

### Application period (March 9 – April 13)

Got acquainted with the GFOSS sch-webapps projectand contacted its mentors.

Created example front-end interface:https://github.com/artemisge/sch-webapps

Due to my lack of time in this period I was only ableto make this simple demo, but I have in
mind something more user friendly for K12-studentsand more aesthetic to look at.

### Community bonding period (May 17– June 6)

Research about nodejs and collect ideas and knowledgeabout the project such as
downloading, extracting and processing the .zip formof the educational applications.


### Phase 1 (June 7 – July 16)

The front-end will be implemented in this time period(see Project goals).

Due to my semester exams I’ll be able to work a littleless in this phase and I’ll make up for it
in the next phase for an average of 30 hours per week.

### Phase 2 (July 17 – August 23)

The back-end and the documentation will be implementedin this time period (see Project
goals).

### Follow up

Automate the sch-webapps installation and resolveany issues that may be reported by its
users.


