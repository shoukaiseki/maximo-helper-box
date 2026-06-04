@echo off
chcp 65001 >nul
echo ========================================
echo    Maximo Excel Exporter (POI Version)
echo ========================================
echo.

echo Compiling POI project...
cd maximo-excel-exporter-poi
call D:\usr\apache\apache-maven-3.9.7\bin\mvn.cmd clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    Compilation successful!
    echo ========================================
    echo Running export...
    java -jar target\maximo-excel-exporter-poi-1.0.0.jar
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo    Export completed successfully!
        echo ========================================
        echo Output: ..\output\
        echo.
        explorer ..\output
    ) else (
        echo.
        echo ========================================
        echo    Export failed!
        echo ========================================
    )
) else (
    echo.
    echo ========================================
    echo    Compilation failed!
    echo ========================================
)

pause