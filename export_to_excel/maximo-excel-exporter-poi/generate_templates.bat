@echo off
chcp 65001 >nul
echo ============================================
echo Generate JXLS Templates (POI Version)
echo ============================================
echo.

cd /d "%~dp0"

set JAVA_HOME=D:\usr\java\jdk-17.0.19x64

echo [1/2] Compiling project...
call "D:\usr\apache\apache-maven-3.9.7\bin\mvn.cmd" clean package -DskipTests -q
if %ERRORLEVEL% neq 0 (
    echo Compile failed!
    pause
    exit /b 1
)
echo Compile successful!

echo.
echo [2/2] Generating Templates...
java -jar target\maximo-excel-exporter-poi-1.0.0.jar --generate-templates
if %ERRORLEVEL% neq 0 (
    echo Template generation failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Templates Generated Successfully!
echo ============================================
echo Location: templates\
pause