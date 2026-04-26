# Maximo Helper Box

Maximo 辅助工具箱，提供库存管理、UI 组件演示等功能模块。

## 项目结构

```
maximo-helper-box/
├── maximo-ui/                    # Maximo UI 组件及业务页面
│   ├── maximo-style.html         # Maximo 9 UI 组件演示（设计规范参考）
│   ├── index_bak1.html           # 首页备份
│   ├── comp1.html                # 组件示例1
│   ├── comp2.html                # 组件示例2
│   ├── maximo-style.html         # Maximo 风格样式参考
│   └── demo01-ui/                 # 演示的UI 页面
│       ├── kucun.html            # 库存管理主页面
│       ├── inventory-list.html   # 库存明细列表
│       └── 其他测试文件...
└── README.md                     # 项目说明文档
```

## 主要功能

### 1. Maximo UI 组件库 (maximo-style.html)

提供 Maximo 9 风格的 UI 组件演示，包含：

- **按钮 (Button)** - 主要按钮、次要按钮
- **对话框 (Dialog)** - 模态对话框、确认弹窗
- **单选框 (Radio Button)** - 选项选择
- **表格 (Table)** - 数据表格展示
- **单行文本框** - 输入字段
- **多行文本框** - 文本域
- **多部分文本框** - 区间字段输入
- **组合框 (ComboBox)** - 下拉选择
- **选项卡组 (Tab Group)** - 标签页切换

**设计特点：**
- 主色调：`#2076d3` (Maximo 蓝)
- 背景色：`#f9f9fc`
- 圆角：`3px-10px`
- 边框色：`#d0d4e6`, `#e3e6f0`
- 悬停背景：`#f2f2fa`

### 2. 库存管理系统 (demo01-ui/kucun.html)

基于 Maximo 风格的库存管理系统，实现：

#### 功能模块
- **库存查看** - 商品库存信息展示（表单式布局）
- **入库记录** - 入库流水查询
- **出库记录** - 出库流水查询
- **批次余量** - FIFO 批次库存明细

#### 数据字段
- 商品编号、中英文名称
- 库存数量、库存金额 (CNY)
- 供应商、大项目
- 采购发票号、采购币种 (CNY/JPY)
- 采购金额、关税、物流费
- 入库/出库时间（格式：`yyyy/m/d h:mm AM/PM`）

#### 技术特性
- Maximo 风格表单布局（Flexbox）
- 折叠面板（表格展开/收起）
- 选项卡切换（库存/入库/出库）
- 文字左对齐、金额右对齐
- 多币种支持（CNY/JPY，汇率：1 CNY = 23.316 JPY）

## 开发规范

### 金额字段命名
- 统一使用 `CNY` 标识，不使用"元"或"(元)"
- 示例：`库存金额 CNY`、`采购单价 CNY(含税)`

### 时间格式
- 入库时间、出库时间使用格式：`yyyy/m/d h:mm AM/PM`
- 示例：`2023/2/15 10:30 AM`

### 表格对齐
- 文字类字段：左对齐
- 金额类字段：右对齐
- 第一列（序号/编号）：居中对齐

### 布局规范
- 短字段：一行两个（Flexbox）
- 长字段：独占一行
- 使用 `readonly` 输入框展示数据

## 快速开始

### 预览页面

直接在浏览器中打开 HTML 文件：

```bash
# Maximo UI 组件演示
open maximo-ui/maximo-style.html

# 库存管理系统
open maximo-ui/demo01-ui/kucun.html

# 库存明细列表
open maximo-ui/demo01-ui/inventory-list.html
```

### 本地开发

无需构建工具，直接编辑 HTML 文件即可。

## 注意事项

- `demo01-ui/` 演示的UI界面
- 所有页面均为纯 HTML/CSS/JS，无后端依赖
- 数据为静态示例数据，实际使用时需对接 API

## 技术栈

- HTML5
- CSS3 (Flexbox)
- Vanilla JavaScript
- 无第三方框架依赖

## License

内部项目，仅供公司内部使用。
