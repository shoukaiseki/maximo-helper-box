@echo off
setlocal enabledelayedexpansion

set MEE_HOME=%~dp0

echo ================================================
echo Maximo Server JXLS Exporter
echo ================================================
echo MEE_HOME=%MEE_HOME%
echo.

set LIB_DIR=%MEE_HOME%lib
set CONF_DIR=%MEE_HOME%conf
set OUTPUT_DIR=%MEE_HOME%output

if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

echo Running JXLS Export...
java -jar "%LIB_DIR%\maximo-server-jxls-1.0.0.jar" --config "%CONF_DIR%\application.yml"

echo.
echo ================================================
echo JXLS Excel Export Completed!
echo Output Directory: %OUTPUT_DIR%
echo ================================================
pause