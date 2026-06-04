@echo off
chcp 65001 >nul
echo ============================================
echo Maximo Excel Exporter (POI Version)
echo ============================================
echo.

cd /d "%~dp0"

set JAVA_HOME=D:\usr\java\jdk-17.0.19x64

echo [1/3] Compiling project...
call "D:\usr\apache\apache-maven-3.9.7\bin\mvn.cmd" clean package -DskipTests -q
if %ERRORLEVEL% neq 0 (
    echo Compile failed!
    pause
    exit /b 1
)
echo Compile successful!

echo.
echo [2/3] Running POI Export...
java -jar target\maximo-excel-exporter-poi-1.0.0.jar
if %ERRORLEVEL% neq 0 (
    echo Run failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Opening output directory...
start "" "output"

echo.
echo ============================================
echo POI Excel Export Completed!
echo ============================================
pause