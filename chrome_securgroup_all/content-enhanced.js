// 增强版内容脚本 - 针对 Maximo 的特殊处理
console.log('\n========================================');
console.log('[CONTENT] ✅ Maximo 增强版内容脚本已加载！');
console.log('[CONTENT] 页面 URL:', window.location.href);
console.log('[CONTENT] 时间:', new Date().toLocaleString());
console.log('========================================\n');

// 存储原始的 toggleSelected 方法引用
window.maximoToggleSelected = null;

// 监听来自popup的消息
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
            
            // 尝试找到 React 组件实例
            const reactRoot = document.querySelector('#root') || document.querySelector('[id*="root"]');
            console.log('[Checkbox Helper] 尝试查找 React 根元素:', reactRoot ? '找到' : '未找到');
            
            checkboxes.forEach((checkbox, index) => {
                try {
                    console.log(`[Checkbox Helper] 处理第 ${index + 1} 个复选框`);
                    console.log(`[Checkbox Helper] ID:`, checkbox.id);
                    console.log(`[Checkbox Helper] 当前状态: checked=${checkbox.checked}`);
                    
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
                    
                    console.log(`[Checkbox Helper] 目标状态: ${targetState}`);
                    
                    // 如果已经是目标状态，跳过
                    if (checkbox.checked === targetState) {
                        console.log(`[Checkbox Helper] 跳过 - 已是目标状态`);
                        skipCount++;
                        return;
                    }
                    
                    // 方法1: 尝试找到并调用 React 的 onChange 处理器
                    const wrapper = checkbox.closest('.cds--checkbox-wrapper, .mx--checkbox-wrapper');
                    if (wrapper) {
                        console.log('[Checkbox Helper] 找到包装元素，尝试触发 React 事件');
                        
                        // 查找 label 元素
                        const label = wrapper.querySelector('label');
                        if (label) {
                            console.log('[Checkbox Helper] 找到 label 元素，模拟点击');
                            
                            // 创建并分发真实的点击事件到 label
                            const clickEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                detail: 1
                            });
                            
                            label.dispatchEvent(clickEvent);
                            console.log('[Checkbox Helper] Label 点击事件已触发');
                            
                            // 等待一小段时间让 React 处理
                            setTimeout(() => {
                                console.log('[Checkbox Helper] 检查状态是否更新:', checkbox.checked);
                            }, 100);
                        }
                    }
                    
                    // 方法2: 使用原生 setter（备用方案）
                    console.log('[Checkbox Helper] 使用原生 setter 设置值');
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype, 
                        'checked'
                    ).set;
                    
                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(checkbox, targetState);
                        console.log('[Checkbox Helper] 原生 setter 调用成功');
                    } else {
                        checkbox.checked = targetState;
                    }
                    
                    console.log(`[Checkbox Helper] 设置后状态: checked=${checkbox.checked}`);
                    
                    // 触发多个事件
                    console.log('[Checkbox Helper] 触发事件...');
                    
                    // input 事件
                    checkbox.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    console.log('[Checkbox Helper] 事件 input 已触发');
                    
                    // change 事件
                    checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    console.log('[Checkbox Helper] 事件 change 已触发');
                    
                    // click 事件
                    checkbox.dispatchEvent(new MouseEvent('click', { 
                        bubbles: true, 
                        cancelable: true,
                        view: window,
                        detail: 1,
                        buttons: 1
                    }));
                    console.log('[Checkbox Helper] 事件 click 已触发');
                    
                    // mousedown 和 mouseup
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
                    console.log('[Checkbox Helper] 事件 mousedown/mouseup 已触发');
                    
                    // 父元素事件
                    if (checkbox.parentElement) {
                        console.log('[Checkbox Helper] 触发父元素事件');
                        checkbox.parentElement.dispatchEvent(new Event('click', { 
                            bubbles: true, 
                            cancelable: true 
                        }));
                        
                        // label 元素
                        const label = checkbox.parentElement.querySelector('label');
                        if (label) {
                            label.dispatchEvent(new Event('click', {
                                bubbles: true,
                                cancelable: true
                            }));
                            console.log('[Checkbox Helper] 触发 label 元素事件');
                        }
                    }
                    
                    successCount++;
                    console.log(`[Checkbox Helper] ✓ 第 ${index + 1} 个复选框操作成功`);
                    
                } catch (error) {
                    errorCount++;
                    console.error(`[Checkbox Helper] ✗ 第 ${index + 1} 个复选框操作失败:`, error.message);
                    console.error('[Checkbox Helper] 错误堆栈:', error.stack);
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
    
    return true; // 保持消息通道开放
});
