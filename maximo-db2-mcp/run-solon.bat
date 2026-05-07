@echo off
chcp 65001 >nul
echo ========================================
echo   Solon Demo Startup Script
echo ========================================
echo.

REM Check and set JAVA_HOME
echo [INFO] Checking Java environment...

REM Always try to find the best JDK for this project (Java 21 required)
set "DETECTED_JDK=D:\usr\java\jdk1.8.0_491x64"

set JAVA_HOME=%DETECTED_JDK%
echo [OK] Using JDK: %JAVA_HOME%

REM Add Java to PATH
set PATH=%JAVA_HOME%\bin;%PATH%

REM Verify Java is working
%JAVA_HOME%/bin/java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java execution failed, check JAVA_HOME: %JAVA_HOME%
    pause
    exit /b 1
)

echo.

REM Set Maven path
set MAVEN_HOME=D:\usr\apache\apache-maven-3.9.7
set MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd

REM Check Maven exists
if not exist "%MAVEN_CMD%" (
    echo [ERROR] Maven not found: %MAVEN_CMD%
    echo Please update MAVEN_HOME in this script
    pause
    exit /b 1
)

echo [1/2] Building project...
call "%MAVEN_CMD%" clean package -q -DskipTests=true

if errorlevel 1 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Starting application...
echo ========================================
echo.

%JAVA_HOME%/bin/java -jar target\maximo-db2-mcp.jar

pause
