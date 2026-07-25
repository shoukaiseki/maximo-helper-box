@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   JXLS Excel Reader
echo   读取 departmentdata.xls (JXLS 官方示例)
echo ========================================
echo.

REM 先打包
call mvn clean package -q -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 编译失败!
    pause
    exit /b 1
)

REM 运行
echo.
java -jar target/maximo-excel-read-jxls-1.0.0.jar

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 读取完成！
) else (
    echo.
    echo ❌ 读取失败
)

pause
