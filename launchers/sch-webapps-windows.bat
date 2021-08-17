@echo off

rem The launcher must NOT be named sch-webapps.bat, to avoid recursion

npx sch-webapps || (
	echo:
	echo Please install nodejs: https://nodejs.org/en/download
	pause
)
