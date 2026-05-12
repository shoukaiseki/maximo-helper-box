@echo off
chcp 65001 >nul
echo ========================================
echo Chrome插件 - 图标配置切换工具
echo ========================================
echo.

if exist "manifest.json" (
    echo 当前使用的是带图标的配置
    echo.
    set /p choice="是否切换到无图标模式以便快速测试? (Y/N): "
    if /i "%choice%"=="Y" (
        rename manifest.json manifest-with-icons.json.bak
        rename manifest-no-icons.json manifest.json
        echo.
        echo ✓ 已切换到无图标模式
        echo 现在可以直接加载插件进行测试了
    ) else (
        echo 保持当前配置不变
    )
) else if exist "manifest-with-icons.json.bak" (
    echo 当前使用的是无图标的配置
    echo.
    set /p choice="是否切换回带图标的配置? (Y/N): "
    if /i "%choice%"=="Y" (
        rename manifest.json manifest-no-icons.json
        rename manifest-with-icons.json.bak manifest.json
        echo.
        echo ✓ 已切换回带图标配置
        echo 请确保 icons 文件夹中有 icon16.png, icon48.png, icon128.png
    ) else (
        echo 保持当前配置不变
    )
) else (
    echo 错误: 找不到配置文件
    pause
    exit /b 1
)

echo.
echo ========================================
pause
