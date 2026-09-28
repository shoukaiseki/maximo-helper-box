@echo off
setlocal enabledelayedexpansion

set MEE_HOME=%~dp0

echo ================================================
echo Maximo Excel JXLS to HTML Converter
echo ================================================
echo MEE_HOME=%MEE_HOME%
echo.

set LIB_DIR=%MEE_HOME%lib
set CONF_DIR=%MEE_HOME%conf
set OUTPUT_DIR=%MEE_HOME%output

if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
)

if not exist "%MEE_HOME%test_template.xls" (
    echo Generating demo template...
    java -jar "%LIB_DIR%\maximo-excel-jxls-tohtml-1.0.0.jar" --create-demo-template="%MEE_HOME%test_template.xls"
)

echo Running JXLS to HTML Export...
java -jar "%LIB_DIR%\maximo-excel-jxls-tohtml-1.0.0.jar" --config "%CONF_DIR%\application.yml" --input="%MEE_HOME%test_input.json" --template="%MEE_HOME%test_template.xls" --output="%OUTPUT_DIR%\demo.html"

echo.
echo ================================================
echo HTML Export Completed!
echo Output: %OUTPUT_DIR%\demo.html
echo ================================================
pause