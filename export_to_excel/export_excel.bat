@echo off
chcp 65001 >nul
echo ========================================
echo    Maximo Excel Exporter
echo ========================================
echo.

echo Exporting Excel...
java -jar target/maximo-excel-exporter-1.0.0.jar

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    Excel exported successfully!
    echo ========================================
    echo Output: output\
    echo.
    echo Opening output folder...
    explorer output
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo    Failed to export Excel!
    echo ========================================
    echo.
    pause
)
