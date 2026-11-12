# Maximo 字段帮助禁用助手

> Chrome 浏览器插件 —— 关闭 Maximo 中“点击字段标签弹出内部字段帮助”的行为，支持一键开关

## 功能

- **默认禁用**点击字段标签（label）时弹出的“内部字段帮助”窗口
- 右上角弹窗提供开关，可随时恢复原始行为
- 设置持久化保存，改动即时同步到所有已打开的 Maximo 页面，无需刷新
- 只拦截标签点击产生的 `internalhelp` 事件，查询、保存、流水号、附件等操作不受影响

## 原理

Maximo 经典 UI 的字段标签渲染为 `<label for="输入框id" ctype="label">`，
`webclient/javascript/library.js` 为 `ctype="label"` 的元素绑定 `el.onclick = label_`，
`label_` 的 click 分支在标签带 `for` 属性（且不含 `nrm` 类）时执行：

```js
sendEvent("internalhelp", elementId, "");
```

服务端收到 `internalhelp` 事件后返回“内部字段帮助”弹窗。插件在页面上下文替换 `window.sendEvent`，
开关为“禁用”时丢弃该事件，并额外在捕获阶段拦截 `label[for]` 的点击作为兜底。

## 安装

1. 打开 `chrome://extensions/`
2. 打开右上角「开发者模式」
3. 点击「加载已解压的扩展程序」，选择本目录（`chrome_label_help`）
4. 打开或刷新 Maximo 页面，点击地址栏右侧的扩展图标确认状态

> 需要 Chrome 111 及以上版本（清单使用了 `world: "MAIN"` 的内容脚本）。

## 使用

- 弹窗顶部开关：**开** = 禁用字段帮助；**关** = 恢复 Maximo 原始行为
- 状态区显示当前标签页检测结果：

| 状态 | 含义 |
| --- | --- |
| 绿点：字段帮助已禁用 | 已生效 |
| 灰点：开关已关闭 | 放行，点击标签会弹窗 |
| 灰点：当前页面不是 Maximo | 仅在 `/maximo/` 路径下注入 |
| 灰点：未检测到页面脚本 | 页面未刷新或扩展刚安装，刷新即可 |

## 目录结构

```
chrome_label_help/
├── manifest.json     # 扩展清单（MV3）
├── page-guard.js     # 页面上下文拦截脚本（MAIN world）
├── content.js        # 隔离环境：读写开关、与页面脚本通信
├── popup.html        # 弹窗界面
├── popup.js          # 弹窗逻辑
├── styles.css        # 弹窗样式
├── icons/            # 图标（16/32/48/128 + svg 源文件）
└── README.md
```

## 生效范围

`matches` 为 `*://*/maximo/*`，覆盖 `http(s)://<主机>/maximo/...` 下的所有页面，
包括 Maximo 经典 UI 与 `manage-shell` 内嵌的 `type=embedded` iframe（`all_frames: true`）。
若你的环境未部署在 `/maximo/` 路径下，修改 `manifest.json` 中两处 `matches` 后重新加载扩展即可。

## 注意事项

- 插件只作用于浏览器端表现，不修改 Maximo 服务端配置；换浏览器或停用扩展即完全恢复原行为。
- `Alt+F1` 触发的 `fieldhelp` 事件不在拦截范围内，仍可正常使用；`Alt+I`（内部帮助）与标签点击同为 `internalhelp`，会被一并拦截。
- 若页面使用了自定义脚本重写 `sendEvent`，插件会在 30 秒内以 250ms、之后以 2s 的频率自动重新接管。

## 故障排除

| 现象 | 处理 |
| --- | --- |
| 弹窗显示“未检测到页面脚本” | 刷新 Maximo 页面；确认扩展已启用 |
| 弹窗显示“当前页面不是 Maximo” | 检查地址是否包含 `/maximo/` |
| 点击标签仍弹窗 | 确认开关为开；到 `chrome://extensions/` 查看本扩展是否报错；必要时移除后重新加载 |
| 修改了 manifest 不生效 | 在 `chrome://extensions/` 点击本扩展的「重新加载」 |

## 开发说明

- 开关存储键：`chrome.storage.local` 中的 `maximoLabelHelpBlocked`（默认 `true`）
- 隔离环境 ↔ 页面上下文通道：
  - 隔离 → 页面：`mx-label-help-content`（`{ type: "state", blocked }`）
  - 页面 → 隔离：`mx-label-help-guard`（`{ type: "ready" | "status", installed, blocked }`）