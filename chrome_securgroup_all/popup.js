document.addEventListener('DOMContentLoaded', function() {
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
    selectAllBtn.addEventListener('click', () => batchOperateCheckboxes('select'));
    deselectAllBtn.addEventListener('click', () => batchOperateCheckboxes('deselect'));
    toggleSelectionBtn.addEventListener('click', () => batchOperateCheckboxes('toggle'));
    refreshCountBtn.addEventListener('click', getCheckboxInfo);

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
}
