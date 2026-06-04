@echo off
chcp 65001 >nul
echo ========================================
echo    Maximo Excel Exporter (JXLS Version)
echo ========================================
echo.

echo Compiling JXLS project...
cd maximo-excel-exporter-jxls
call D:\usr\apache\apache-maven-3.9.7\bin\mvn.cmd clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    Compilation successful!
    echo ========================================
    echo Running JXLS export...
    java -jar target\maximo-excel-exporter-jxls-1.0.0.jar
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo    JXLS Export completed successfully!
        echo ========================================
        echo Output: ..\output\
        echo.
        explorer ..\output
    ) else (
        echo.
        echo ========================================
        echo    JXLS Export failed!
        echo ========================================
    )
) else (
    echo.
    echo ========================================
    echo    Compilation failed!
    echo ========================================
)

pause