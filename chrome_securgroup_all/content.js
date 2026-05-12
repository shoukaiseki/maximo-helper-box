// 内容脚本 - 在页面加载时执行
console.log('批量复选框勾选助手已加载');

// 监听来自popup的消息（如果需要扩展功能）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCheckboxInfo') {
        const checkboxes = document.querySelectorAll('input.cds--checkbox');
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        sendResponse({ total, checked });
    } else if (request.action === 'operateCheckboxes') {
        const { selector, operation } = request;
        const checkboxes = document.querySelectorAll(selector);
        
        checkboxes.forEach(checkbox => {
            // 确定目标状态
            let targetState;
            switch (operation) {
                case 'select':
                    targetState = true;
                    break;
                case 'deselect':
                    targetState = false;
                    break;
                case 'toggle':
                    targetState = !checkbox.checked;
                    break;
            }
            
            // 如果已经是目标状态，跳过
            if (checkbox.checked === targetState) {
                return;
            }
            
            // 方法1: 尝试使用原生值设置器（针对React等框架）
            try {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 
                    'checked'
                ).set;
                
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(checkbox, targetState);
                } else {
                    checkbox.checked = targetState;
                }
            } catch (e) {
                // 降级到直接设置
                checkbox.checked = targetState;
            }
            
            // 触发多个事件以确保框架能捕获到变化
            const events = [
                new Event('input', { bubbles: true, cancelable: true }),
                new Event('change', { bubbles: true, cancelable: true }),
                new MouseEvent('click', { 
                    bubbles: true, 
                    cancelable: true,
                    view: window
                })
            ];
            
            events.forEach(event => {
                checkbox.dispatchEvent(event);
            });
            
            // 额外触发父元素的事件（某些框架会监听父元素）
            if (checkbox.parentElement) {
                checkbox.parentElement.dispatchEvent(new Event('click', { 
                    bubbles: true, 
                    cancelable: true 
                }));
            }
        });
        
        sendResponse({ success: true, count: checkboxes.length });
    }
});
