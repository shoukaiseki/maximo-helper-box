# Chrome 插件诊断脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chrome 插件诊断工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pluginPath = "e:\gitwork\maximo-helper-box\chrome_securgroup_all"

# 检查文件夹是否存在
Write-Host "[1] 检查插件文件夹..." -ForegroundColor Yellow
if (Test-Path $pluginPath) {
    Write-Host "    ✓ 文件夹存在: $pluginPath" -ForegroundColor Green
} else {
    Write-Host "    ✗ 文件夹不存在: $pluginPath" -ForegroundColor Red
    exit 1
}

# 检查必需文件
Write-Host ""
Write-Host "[2] 检查必需文件..." -ForegroundColor Yellow
$requiredFiles = @("manifest.json", "content.js", "popup.html", "popup.js", "styles.css")
$allFilesExist = $true

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $pluginPath $file
    if (Test-Path $filePath) {
        Write-Host "    ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "    ✗ $file (缺失)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "    ⚠ 有文件缺失，插件可能无法正常工作" -ForegroundColor Yellow
}

# 检查 manifest.json 内容
Write-Host ""
Write-Host "[3] 检查 manifest.json..." -ForegroundColor Yellow
$manifestPath = Join-Path $pluginPath "manifest.json"
try {
    $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
    Write-Host "    ✓ manifest.json 格式正确" -ForegroundColor Green
    Write-Host "    - 名称: $($manifest.name)" -ForegroundColor White
    Write-Host "    - 版本: $($manifest.version)" -ForegroundColor White
    Write-Host "    - Manifest版本: $($manifest.manifest_version)" -ForegroundColor White
    
    if ($manifest.content_scripts) {
        Write-Host "    - 内容脚本: 已配置" -ForegroundColor Green
    } else {
        Write-Host "    - 内容脚本: 未配置" -ForegroundColor Red
    }
} catch {
    Write-Host "    ✗ manifest.json 格式错误" -ForegroundColor Red
    Write-Host "    错误信息: $_" -ForegroundColor Red
}

# 检查 content.js 是否有语法错误
Write-Host ""
Write-Host "[4] 检查 content.js..." -ForegroundColor Yellow
$contentPath = Join-Path $pluginPath "content.js"
try {
    $content = Get-Content $contentPath -Raw
    if ($content -match "console\.log") {
        Write-Host "    ✓ content.js 包含日志输出" -ForegroundColor Green
    } else {
        Write-Host "    ⚠ content.js 没有日志输出" -ForegroundColor Yellow
    }
    
    # 检查是否有明显的语法错误
    if ($content -match "chrome\.runtime\.onMessage") {
        Write-Host "    ✓ content.js 包含消息监听器" -ForegroundColor Green
    }
} catch {
    Write-Host "    ✗ 读取 content.js 失败" -ForegroundColor Red
}

# 显示文件列表
Write-Host ""
Write-Host "[5] 插件文件夹中的所有文件:" -ForegroundColor Yellow
Get-ChildItem $pluginPath -File | ForEach-Object {
    $size = if ($_.Length -gt 1KB) { "$([math]::Round($_.Length/1KB, 2)) KB" } else { "$($_.Length) B" }
    Write-Host "    - $($_.Name) ($size)" -ForegroundColor White
}

# 给出建议
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "下一步操作建议:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 打开 Chrome 浏览器" -ForegroundColor White
Write-Host "2. 访问 chrome://extensions/" -ForegroundColor White
Write-Host "3. 开启右上角的 '开发者模式'" -ForegroundColor White
Write-Host "4. 如果已有旧版本插件，先点击 '移除'" -ForegroundColor White
Write-Host "5. 点击 '加载已解压的扩展程序'" -ForegroundColor White
Write-Host "6. 选择文件夹: $pluginPath" -ForegroundColor White
Write-Host "7. 确认插件出现在列表中且开关是蓝色的" -ForegroundColor White
Write-Host "8. 打开任意网页（如 baidu.com）" -ForegroundColor White
Write-Host "9. 按 F12 打开控制台" -ForegroundColor White
Write-Host "10. 刷新页面（F5）" -ForegroundColor White
Write-Host ""
Write-Host "如果看到弹窗或日志，说明插件工作正常！" -ForegroundColor Green
Write-Host ""
Write-Host "如果还是没有任何反应，请截图 chrome://extensions/ 页面发给我" -ForegroundColor Yellow
Write-Host ""

pause
