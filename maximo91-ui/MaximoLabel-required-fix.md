# MaximoLabel required=true 时标签不显示问题修复方案

## 问题描述

当 `MaximoTextbox` 设置 `:required="true"` 时，整个标签文字和必填图标（`required_label.gif`）都不显示。

## 根本原因

`maximo.css`（第447行）中存在全局 CSS 规则：

```css
.required:not(.text):not(.label) { 
  visibility: hidden; 
  margin: 0px; 
  height: 0.75em; 
  margin-inline-end: 16px; 
}
```

### 原始 Maximo 的设计意图

在原始 Maximo 中，`<label>` 元素同时拥有 `text`、`label`、`required` 三个 class：

```html
<label class="text label required">零件号</label>
```

因为有 `label` 类，`:not(.label)` 排除了它，所以不会触发 `visibility: hidden`。

而 `.required:not(.text):not(.label)` 这条规则的真正目标是 Maximo 中的必填图标元素：

```html
<img class="required" src="required_label.gif" style="visibility:visible">
```

该图标默认隐藏，通过内联样式 `style="visibility:visible"` 在需要时显示。

### Vue 组件中的冲突

MaximoLabel.vue 的根 div 只添加了 `required` 类，没有 `text` 和 `label` 类：

```html
<!-- 修复前 -->
<div class="maximo-label required">...</div>
```

导致 `.required:not(.text):not(.label)` 选择器匹配成功，整个标签区域被 `visibility: hidden` 隐藏。

## 修复方案

在 `MaximoLabel.vue` 中做两处修改：

### 1. 根 div 添加 `text label` 类

```html
<!-- 修复后 -->
<div class="maximo-label text label" :class="{ 'required': required, 'multiline': multiline }">
```

使 `:not(.text):not(.label)` 不再匹配该元素，与原始 Maximo 的模式一致。

### 2. scoped CSS 添加 `visibility: visible` 覆盖

```css
.maximo-label.required {
  font-weight: 500;
  visibility: visible;  /* 确保覆盖 maximo.css 的全局规则 */
}
```

即使 `text label` 类已经排除了全局规则的匹配，仍显式声明 `visibility: visible` 作为防御性样式，避免其他 CSS 规则意外影响。

## 修改文件

- `src/components/MaximoLabel.vue`

## 经验总结

在 Maximo Vue 组件开发中，需注意 `maximo.css` 中基于 class 的全局选择器。当 Vue 组件的 class 命名与 Maximo 原始 DOM 结构不一致时，可能被意外的 CSS 规则匹配。关键原则：

1. **class 命名对齐**：Vue 组件的根元素 class 应尽量与原始 Maximo DOM 结构保持一致
2. **防御性样式**：对于可能被全局规则影响的属性，显式声明覆盖值
3. **排查思路**：标签/图标不显示时，优先检查 `visibility`、`display`、`opacity` 等属性是否被全局 CSS 规则覆盖
