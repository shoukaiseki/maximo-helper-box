/**
 * Maximo 字段帮助禁用助手 —— popup 逻辑
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'maximoLabelHelpBlocked';
  const DEFAULT_BLOCKED = true;

  const toggle = document.getElementById('toggle');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const switchHint = document.getElementById('switch-hint');

  function normalize(value) {
    return value !== false;
  }

  function setStatus(state, text) {
    statusDot.className = 'dot ' + state;
    statusText.textContent = text;
  }

  function updateHint(blocked) {
    switchHint.textContent = blocked
      ? '关闭点击字段标签时弹出的“内部字段帮助”窗口'
      : '已放行：点击字段标签会重新弹出“内部字段帮助”窗口';
  }

  let statusSeq = 0;

  async function refreshPageStatus() {
    const seq = ++statusSeq;
    const isStale = () => seq !== statusSeq;

    let tab = null;
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = tabs && tabs[0];
    } catch (err) {
      tab = null;
    }
    if (isStale()) return;

    if (!tab || !tab.url) {
      setStatus('unknown', '无法读取当前标签页地址');
      return;
    }

    if (!/\/maximo\//i.test(tab.url)) {
      setStatus('unknown', '当前页面不是 Maximo，仅在 /maximo/ 路径下生效');
      return;
    }

    let reply = null;
    try {
      reply = await chrome.tabs.sendMessage(tab.id, { type: 'maximoLabelHelpStatus' });
    } catch (err) {
      reply = null;
    }
    if (isStale()) return;

    if (!reply) {
      setStatus('unknown', '未检测到页面脚本，请刷新 Maximo 页面后重试');
      return;
    }

    if (reply.blocked) {
      setStatus(reply.guardInstalled === false ? 'warn' : 'active',
        reply.guardInstalled === false
          ? 'Maximo 页面：拦截已开启，页面脚本尚未就绪'
          : 'Maximo 页面：字段帮助已禁用');
    } else {
      setStatus('idle', 'Maximo 页面：开关已关闭，点击标签会弹出帮助');
    }
  }

  async function init() {
    let blocked = DEFAULT_BLOCKED;
    try {
      const items = await chrome.storage.local.get({ [STORAGE_KEY]: DEFAULT_BLOCKED });
      blocked = normalize(items[STORAGE_KEY]);
    } catch (err) {
      blocked = DEFAULT_BLOCKED;
    }

    toggle.checked = blocked;
    updateHint(blocked);
    refreshPageStatus();
  }

  toggle.addEventListener('change', async () => {
    const blocked = toggle.checked;
    updateHint(blocked);
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: blocked });
    } catch (err) {
      setStatus('unknown', '保存设置失败，请重试');
      return;
    }
    // 等待内容脚本接收 storage 变更后重新检测
    setTimeout(refreshPageStatus, 250);
  });

  init();
})();