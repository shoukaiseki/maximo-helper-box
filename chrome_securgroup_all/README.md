# Maximo 安全组批量授权助手

> Chrome 浏览器插件 - 专为 Maximo 9.1 系统设计

## 📖 文档

所有文档已移至 `docs/` 目录：

- **[📘 使用指南](./docs/HELP.md)** - 详细的使用说明和场景示例
- **[🚀 快速开始](./docs/README.md)** - 安装和基本使用
- **[🔧 安装指南](./docs/INSTALL.md)** - 详细的安装步骤
- **[🐛 故障排除](./docs/TROUBLESHOOTING.md)** - 常见问题解决方案
- **[📝 更新日志](./docs/CHANGELOG.md)** - 版本更新历史

## 🎯 主要功能

- ✅ 批量勾选/取消勾选复选框
- ✅ 支持循环操作（自动滚动加载）
- ✅ 智能验证机制
- ✅ 持久化保存设置
- ✅ 实时统计显示

## 💡 应用场景

主要用于 **Maximo 安全组批量授权**场景，也可用于其他需要批量操作复选框的场景。

## 📁 项目结构

```
chrome_securgroup_all/
├── manifest.json          # 插件配置
├── popup.html            # 弹出界面
├── popup.js              # 弹出逻辑
├── content.js            # 内容脚本
├── styles.css            # 样式文件
├── icons/                # 图标
└── docs/                 # 文档目录
```

## 🚀 快速安装

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本目录

**详细说明请查看 [🚀 快速开始](./docs/README.md)**

---

**祝您使用愉快！** 🎉
