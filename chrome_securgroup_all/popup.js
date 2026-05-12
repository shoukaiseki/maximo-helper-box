document.addEventListener('DOMContentLoaded', function() {
    console.log('========================================');
    console.log('[POPUP] 弹出窗口已加载！');
    console.log('[POPUP] 时间:', new Date().toLocaleString());
    console.log('========================================');
    
    // 获取DOM元素
    const selectorType = document.getElementById('selector-type');
    const customSelectorGroup = document.getElementById('custom-selector-group');
    const customSelector = document.getElementById('custom-selector');
    const selectAllBtn = document.getElementById('select-all');
    const deselectAllBtn = document.getElementById('deselect-all');
    const toggleSelectionBtn = document.getElementById('toggle-selection');
    const refreshCountBtn = document.getElementById('refresh-count');
    const checkboxCountEl = document.getElementById('checkbox-count');
    const checkedCountEl = document.getElementById('checked-count');

    console.log('[POPUP] DOM元素已获取');

    // 显示/隐藏自定义选择器输入框
    selectorType.addEventListener('change', function() {
        if (this.value === 'custom') {
            customSelectorGroup.style.display = 'block';
        } else {
            customSelectorGroup.style.display = 'none';
        }
    });

    // 获取当前页面的复选框信息
    async function getCheckboxInfo() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                console.error('无法获取当前标签页');
                return;
            }

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getCurrentCheckboxInfo
            });

            if (results && results[0] && results[0].result) {
                const info = results[0].result;
                checkboxCountEl.textContent = info.total;
                checkedCountEl.textContent = info.checked;
            }
        } catch (error) {
            console.error('执行脚本时出错:', error);
        }
    }

    // 批量操作复选框
    async function batchOperateCheckboxes(operation) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                console.error('无法获取当前标签页');
                return;
            }

            let selector = '';
            switch (selectorType.value) {
                case 'cds-checkbox':
                    selector = 'input.cds--checkbox';
                    break;
                case 'custom':
                    selector = customSelector.value || 'input[type="checkbox"]';
                    break;
                case 'all':
                    selector = 'input[type="checkbox"]';
                    break;
                default:
                    selector = 'input.cds--checkbox';
            }

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: operateCheckboxes,
                args: [selector, operation]
            });

            // 操作后刷新统计
            setTimeout(getCheckboxInfo, 100);
        } catch (error) {
            console.error('执行脚本时出错:', error);
        }
    }

    // 事件监听器
    console.log('[POPUP] 正在绑定按钮事件...');
    
    selectAllBtn.addEventListener('click', () => {
        console.log('\n========================================');
        console.log('[POPUP] 🖱️ 用户点击了【全选】按钮！');
        console.log('[POPUP] 时间:', new Date().toLocaleString());
        console.log('========================================\n');
        batchOperateCheckboxes('select');
    });
    
    deselectAllBtn.addEventListener('click', () => {
        console.log('\n========================================');
        console.log('[POPUP] 🖱️ 用户点击了【取消全选】按钮！');
        console.log('[POPUP] 时间:', new Date().toLocaleString());
        console.log('========================================\n');
        batchOperateCheckboxes('deselect');
    });
    
    toggleSelectionBtn.addEventListener('click', () => {
        console.log('\n========================================');
        console.log('[POPUP] 🖱️ 用户点击了【反选】按钮！');
        console.log('[POPUP] 时间:', new Date().toLocaleString());
        console.log('========================================\n');
        batchOperateCheckboxes('toggle');
    });
    
    refreshCountBtn.addEventListener('click', () => {
        console.log('[POPUP] 🖱️ 用户点击了【刷新统计】按钮');
        getCheckboxInfo();
    });
    
    console.log('[POPUP] ✅ 所有按钮事件已绑定');

    // 初始化时获取统计信息
    getCheckboxInfo();
});

// 在当前页面获取复选框信息的函数
function getCurrentCheckboxInfo() {
    const checkboxes = document.querySelectorAll('input.cds--checkbox');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    return { total, checked };
}

// 操作复选框的函数 - 模拟真实点击以支持双向绑定
function operateCheckboxes(selector, operation) {
    try {
        console.log('[Checkbox Helper] 开始操作复选框');
        console.log('[Checkbox Helper] 选择器:', selector);
        console.log('[Checkbox Helper] 操作类型:', operation);
        
        const checkboxes = document.querySelectorAll(selector);
        console.log('[Checkbox Helper] 找到复选框数量:', checkboxes.length);
        
        if (checkboxes.length === 0) {
            console.warn('[Checkbox Helper] 未找到匹配的复选框！');
            console.log('[Checkbox Helper] 提示: 尝试使用 "所有复选框" 模式或检查自定义选择器');
            return { success: false, count: 0, error: 'No checkboxes found' };
        }
        
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        
        checkboxes.forEach((checkbox, index) => {
            try {
                console.log(`[Checkbox Helper] 处理第 ${index + 1} 个复选框`);
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
                
                // 方法1: 尝试使用原生值设置器（针对React等框架）
                console.log('[Checkbox Helper] 使用原生 setter 设置值');
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 
                    'checked'
                ).set;
                
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(checkbox, targetState);
                    console.log('[Checkbox Helper] 原生 setter 调用成功');
                } else {
                    console.log('[Checkbox Helper] 降级到直接设置');
                    checkbox.checked = targetState;
                }
                
                console.log(`[Checkbox Helper] 设置后状态: checked=${checkbox.checked}`);
                
                // 触发多个事件以确保框架能捕获到变化
                console.log('[Checkbox Helper] 触发事件...');
                
                // 方法1: 尝试找到并点击 label 元素（最有效的方法）
                const wrapper = checkbox.closest('.cds--checkbox-wrapper, .mx--checkbox-wrapper');
                if (wrapper) {
                    const label = wrapper.querySelector('label');
                    if (label) {
                        console.log('[Checkbox Helper] 点击 label 元素');
                        label.click();
                        console.log('[Checkbox Helper] label 点击已触发');
                    } else {
                        console.log('[Checkbox Helper] 未找到 label，点击 wrapper');
                        wrapper.click();
                    }
                } else {
                    console.log('[Checkbox Helper] 未找到 wrapper，直接点击 checkbox');
                    checkbox.click();
                }
                
                // 方法2: 触发 input 事件
                checkbox.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                console.log('[Checkbox Helper] 事件 input 已触发');
                
                // 方法3: 触发 change 事件
                checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                console.log('[Checkbox Helper] 事件 change 已触发');
                
                // 方法4: 触发 click 事件（模拟真实点击）
                checkbox.dispatchEvent(new MouseEvent('click', { 
                    bubbles: true, 
                    cancelable: true,
                    view: window,
                    detail: 1,
                    buttons: 1
                }));
                console.log('[Checkbox Helper] 事件 click 已触发');
                
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
                console.log('[Checkbox Helper] 事件 mousedown/mouseup 已触发');
                
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
        
        console.log('[Checkbox Helper] ========== 操作完成 ==========');
        console.log(`[Checkbox Helper] 总计: ${checkboxes.length}, 成功: ${successCount}, 跳过: ${skipCount}, 错误: ${errorCount}`);
        
        return { 
            success: true, 
            total: checkboxes.length,
            successCount, 
            skipCount,
            errorCount
        };
        
    } catch (error) {
        console.error('[Checkbox Helper] 操作失败:', error);
        return { success: false, error: error.message };
    }
}
