// 最简单的测试版本 - content.js
console.log('### CONTENT SCRIPT LOADED ###');
console.log('页面URL:', window.location.href);
console.log('时间:', new Date().toString());

alert('内容脚本已加载！如果你看到这个弹窗，说明插件工作正常！');
