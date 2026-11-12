/**
 * Maximo 字段帮助禁用助手 —— 页面上下文脚本（MAIN world）
 *
 * 原理（对照 maximouiweb.war/webclient/javascript/library.js）：
 *   经典 UI 中字段标签渲染为 <label for="输入框id" ctype="label">，
 *   ctype 为 label 的元素在 bindEvent 时被绑定 el.onclick = label_，
 *   而 label_ 的 click 分支在标签带 for 属性（且不含 nrm 类）时执行：
 *       sendEvent("internalhelp", elementId, "");
 *   服务端收到 internalhelp 事件后返回“内部字段帮助”弹窗。
 *
 * 本脚本在页面上下文（MAIN world）替换 window.sendEvent，
 * 开关为“禁用”时丢弃 internalhelp 事件，从而不再弹出字段帮助；
 * 同时以捕获阶段的 click 监听作为兜底，覆盖 sendEvent 被后续脚本重写的情况。
 */
(() => {
  'use strict';

  const INSTALL_FLAG = '__maximoLabelHelpGuardInstalled__';
  if (window[INSTALL_FLAG]) return;
  Object.defineProperty(window, INSTALL_FLAG, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
  });

  const CHANNEL_TO_PAGE = 'mx-label-help-content'; // 隔离环境 -> 页面
  const CHANNEL_FROM_PAGE = 'mx-label-help-guard'; // 页面 -> 隔离环境
  const HELP_EVENT = 'internalhelp';

  let blocked = true; // 默认拦截：禁用点击标签弹出字段帮助
  let wrapped = false;

  function isHelpEvent(eventName) {
    return typeof eventName === 'string' && eventName.trim().toLowerCase() === HELP_EVENT;
  }

  function postToContent(payload) {
    try {
      window.postMessage(Object.assign({ channel: CHANNEL_FROM_PAGE }, payload), '*');
    } catch (err) {
      // 忽略消息发送异常
    }
  }

  function notifyStatus() {
    postToContent({ type: 'status', installed: wrapped, blocked: blocked });
  }

  function install() {
    const current = window.sendEvent;
    if (typeof current !== 'function') return false;

    if (current.__mxLabelHelpGuardWrapped) {
      wrapped = true;
      return true;
    }

    const original = current;
    const wrapper = function (eventName) {
      if (blocked && isHelpEvent(eventName)) {
        // 丢弃 internalhelp 事件：服务端不会再返回字段帮助内容
        return false;
      }
      return original.apply(this, arguments);
    };
    wrapper.__mxLabelHelpGuardWrapped = true;

    window.sendEvent = wrapper;
    wrapped = true;
    notifyStatus();
    return true;
  }

  /**
   * 兜底：在捕获阶段拦截带 for 属性的标签点击。
   * 只拦 click（label_ 的 click 分支才是 internalhelp 的唯一入口），
   * 不阻止默认行为，标签聚焦输入框等原生效果保持不变。
   */
  function onLabelClickCapture(event) {
    if (!blocked) return;
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;

    const label = target.closest('label[for]');
    if (!label) return;
    if (String(label.className || '').indexOf('nrm') !== -1) return; // 空表格提示等静态标签

    event.stopPropagation();
  }

  window.addEventListener('click', onLabelClickCapture, true);

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.channel !== CHANNEL_TO_PAGE) return;

    if (data.type === 'state') {
      blocked = data.blocked !== false;
      install();
      notifyStatus();
    }
  });

  // 首次尝试 + 轮询等待 library.js 定义 sendEvent
  install();
  let fastTimer = setInterval(() => install(), 250);
  let slowTimer = null;
  // 30 秒后降为低频守护，防止异步刷新替换掉 sendEvent
  setTimeout(() => {
    clearInterval(fastTimer);
    fastTimer = null;
    slowTimer = setInterval(() => install(), 2000);
  }, 30000);

  postToContent({ type: 'ready', installed: wrapped });
})();