@echo off
chcp 65001 >nul
echo ========================================
echo    Maximo Excel Template Generator
echo ========================================
echo.

echo Generating templates...
java -jar target/maximo-excel-exporter-1.0.0.jar --generate-templates

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    Templates generated successfully!
    echo ========================================
    echo Location: templates\
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo    Failed to generate templates!
    echo ========================================
    echo.
    pause
)
