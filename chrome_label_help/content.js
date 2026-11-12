/**
 * Maximo 字段帮助禁用助手 —— 内容脚本（隔离环境）
 *
 * 职责：
 *   1. 从 chrome.storage 读取 / 监听开关状态；
 *   2. 通过 window.postMessage 把状态同步给页面上下文的 page-guard.js；
 *   3. 响应 popup 的状态查询，用于展示“当前页面是否已生效”。
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'maximoLabelHelpBlocked';
  const DEFAULT_BLOCKED = true; // 默认禁用字段帮助
  const CHANNEL_TO_PAGE = 'mx-label-help-content'; // 隔离环境 -> 页面
  const CHANNEL_FROM_PAGE = 'mx-label-help-guard'; // 页面 -> 隔离环境

  let blocked = DEFAULT_BLOCKED;
  let guardInstalled = null; // null 表示页面脚本尚未回报

  function postToPage(payload) {
    try {
      window.postMessage(Object.assign({ channel: CHANNEL_TO_PAGE }, payload), '*');
    } catch (err) {
      // 忽略消息发送异常
    }
  }

  function pushState() {
    postToPage({ type: 'state', blocked: blocked });
  }

  function normalize(value) {
    return value !== false;
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.channel !== CHANNEL_FROM_PAGE) return;

    if (typeof data.installed === 'boolean') guardInstalled = data.installed;

    if (data.type === 'ready' || data.type === 'request-state') {
      pushState();
    }
  });

  function loadState() {
    try {
      chrome.storage.local
        .get({ [STORAGE_KEY]: DEFAULT_BLOCKED })
        .then((items) => {
          blocked = normalize(items[STORAGE_KEY]);
          pushState();
        })
        .catch(() => {
          pushState();
        });
    } catch (err) {
      pushState();
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    const change = changes[STORAGE_KEY];
    if (!change) return;
    blocked = normalize(change.newValue);
    pushState();
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== 'maximoLabelHelpStatus') return;
    sendResponse({
      blocked: blocked,
      guardInstalled: guardInstalled,
      url: location.href
    });
    return true;
  });

  loadState();
})();