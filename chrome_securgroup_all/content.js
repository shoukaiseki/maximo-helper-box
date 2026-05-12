// 内容脚本 - 在页面加载时执行
console.log('\n========================================');
console.log('[CONTENT] ✅ 内容脚本已加载！');
console.log('[CONTENT] 页面 URL:', window.location.href);
console.log('[CONTENT] 时间:', new Date().toLocaleString());
console.log('========================================\n');

// 监听来自popup的消息（如果需要扩展功能）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Checkbox Helper] 收到消息:', request);
    
    try {
        if (request.action === 'getCheckboxInfo') {
            const checkboxes = document.querySelectorAll('input.cds--checkbox');
            const total = checkboxes.length;
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            
            console.log('[Checkbox Helper] 复选框统计 - 总数:', total, '已勾选:', checked);
            sendResponse({ total, checked });
            
        } else if (request.action === 'operateCheckboxes') {
            const { selector, operation } = request;
            console.log('[Checkbox Helper] 操作复选框 - 选择器:', selector, '操作:', operation);
            
            const checkboxes = document.querySelectorAll(selector);
            console.log('[Checkbox Helper] 找到复选框数量:', checkboxes.length);
            
            if (checkboxes.length === 0) {
                console.warn('[Checkbox Helper] 未找到匹配的复选框！');
                sendResponse({ success: false, count: 0, error: 'No checkboxes found' });
                return true;
            }
            
            let successCount = 0;
            let skipCount = 0;
            let errorCount = 0;
            
            checkboxes.forEach((checkbox, index) => {
                try {
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
                        default:
                            targetState = true;
                    }
                    
                    // 如果已经是目标状态，跳过
                    if (checkbox.checked === targetState) {
                        skipCount++;
                        return;
                    }
                    
                    // 方法1: 尝试使用原生值设置器（针对React等框架）
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype, 
                        'checked'
                    ).set;
                    
                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(checkbox, targetState);
                    } else {
                        checkbox.checked = targetState;
                    }
                    
                    // 触发多个事件以确保框架能捕获到变化
                    
                    // 方法1: 尝试找到并点击 label 元素（最有效的方法）
                    const wrapper = checkbox.closest('.cds--checkbox-wrapper, .mx--checkbox-wrapper');
                    if (wrapper) {
                        const label = wrapper.querySelector('label');
                        if (label) {
                            label.click();
                        } else {
                            wrapper.click();
                        }
                    } else {
                        checkbox.click();
                    }
                    
                    // 方法2: 触发 input 事件
                    checkbox.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    
                    // 方法3: 触发 change 事件
                    checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    
                    // 方法4: 触发 click 事件
                    checkbox.dispatchEvent(new MouseEvent('click', { 
                        bubbles: true, 
                        cancelable: true,
                        view: window,
                        detail: 1,
                        buttons: 1
                    }));
                    
                    // 方法5: 触发 mousedown 和 mouseup
                    checkbox.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        buttons: 1
                    }));
                    
                    checkbox.dispatchEvent(new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    
                    // 额外触发父元素的事件
                    if (checkbox.parentElement) {
                        checkbox.parentElement.dispatchEvent(new Event('click', { 
                            bubbles: true, 
                            cancelable: true 
                        }));
                    }
                    
                    successCount++;
                    console.log(`[Checkbox Helper] ✓ 第 ${index + 1} 个复选框操作成功`);
                    
                } catch (error) {
                    errorCount++;
                    console.error(`[Checkbox Helper] ✗ 第 ${index + 1} 个复选框操作失败:`, error.message);
                }
            });
            
            console.log('[Checkbox Helper] 操作完成 - 成功:', successCount, '跳过:', skipCount, '错误:', errorCount);
            sendResponse({ 
                success: true, 
                count: checkboxes.length, 
                successCount, 
                skipCount,
                errorCount
            });
        }
    } catch (error) {
        console.error('[Checkbox Helper] 处理消息时出错:', error);
        sendResponse({ success: false, error: error.message });
    }
    
    return true; // 保持消息通道开放以进行异步响应
});
