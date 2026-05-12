# 批量复选框勾选助手 - Chrome插件

## 安装说明

### 方法1：手动创建图标（推荐）

由于图标文件需要是PNG格式，你可以：

1. 打开 `icons/generate-icons.html` 文件
2. 右键点击每个canvas元素，选择"图片另存为"
3. 分别保存为：
   - `icons/icon16.png` (16x16像素)
   - `icons/icon48.png` (48x48像素)
   - `icons/icon128.png` (128x128像素)

### 方法2：使用临时图标

如果暂时不需要图标，可以：
1. 在 [manifest.json](file://e:\gitwork\maximo-helper-box\chrome_securgroup_all\manifest.json) 中注释掉图标相关配置
2. 或者创建任意16x16、48x48、128x128的PNG图片放入icons文件夹

## 安装步骤

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本文件夹 `e:\gitwork\maximo-helper-box\chrome_securgroup_all`

## 使用方法

1. 访问包含复选框的网页（特别是带有 `cds--checkbox` 类的页面）
2. 点击浏览器工具栏中的插件图标
3. 在弹出窗口中：
   - 选择要操作的复选框类型
   - 点击"全选"、"取消全选"或"反选"按钮
   - 查看复选框统计信息

## 功能特点

- ✅ 专门针对 CDS (Carbon Design System) 复选框优化
- ✅ 支持自定义CSS选择器
- ✅ 支持操作所有复选框
- ✅ 实时统计复选框数量
- ✅ 一键全选/取消/反选
- ✅ 自动触发change事件，确保页面响应

## 文件结构

```
chrome_securgroup_all/
├── manifest.json          # 插件配置文件
├── popup.html            # 弹出界面
├── popup.js              # 弹出界面逻辑
├── content.js            # 内容脚本
├── styles.css            # 样式文件
├── icons/                # 图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── generate-icons.html
└── README.md             # 说明文档
```

## 技术说明

- 使用 Manifest V3（最新的Chrome插件标准）
- 采用 `chrome.scripting` API 进行页面操作
- 支持异步操作和错误处理
- 自动触发DOM事件以确保页面正确响应
