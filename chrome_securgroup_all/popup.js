document.addEventListener('DOMContentLoaded', async function() {
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
    const autoLoopCheckbox = document.getElementById('auto-loop');

    console.log('[POPUP] DOM元素已获取');
    
    // 加载保存的循环操作状态
    try {
        const result = await chrome.storage.local.get(['autoLoopEnabled']);
        if (result.autoLoopEnabled !== undefined) {
            autoLoopCheckbox.checked = result.autoLoopEnabled;
            console.log(`[POPUP] 📦 加载保存的状态: 循环操作=${result.autoLoopEnabled}`);
        }
    } catch (error) {
        console.error('[POPUP] ❌ 加载状态失败:', error);
    }

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
    
    selectAllBtn.addEventListener('click', async () => {
        console.log('\n========================================');
        console.log('[POPUP] 🖱️ 用户点击了【全选】按钮！');
        console.log('[POPUP] 时间:', new Date().toLocaleString());
        console.log('[POPUP] 循环全选:', autoLoopCheckbox.checked ? '开启' : '关闭');
        console.log('========================================\n');
        
        if (autoLoopCheckbox.checked) {
            await autoLoopSelectAll();
        } else {
            batchOperateCheckboxes('select');
        }
    });
    
    deselectAllBtn.addEventListener('click', async () => {
        console.log('\n========================================');
        console.log('[POPUP] 🖱️ 用户点击了【取消全选】按钮！');
        console.log('[POPUP] 时间:', new Date().toLocaleString());
        console.log('[POPUP] 循环取消:', autoLoopCheckbox.checked ? '开启' : '关闭');
        console.log('========================================\n');
        
        if (autoLoopCheckbox.checked) {
            await autoLoopDeselectAll();
        } else {
            batchOperateCheckboxes('deselect');
        }
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
    
    // 帮助文档按钮
    const helpBtn = document.getElementById('help-btn');
    helpBtn.addEventListener('click', () => {
        console.log('[POPUP] 🖱️ 用户点击了【帮助文档】按钮');
        // 打开帮助文档
        chrome.tabs.create({
            url: chrome.runtime.getURL('help.html')
        });
    });
    
    // 监听循环操作复选框的变化，保存状态
    autoLoopCheckbox.addEventListener('change', async function() {
        try {
            await chrome.storage.local.set({ autoLoopEnabled: this.checked });
            console.log(`[POPUP] 💾 已保存循环操作状态: ${this.checked}`);
        } catch (error) {
            console.error('[POPUP] ❌ 保存状态失败:', error);
        }
    });
    
    console.log('[POPUP] ✅ 所有按钮事件已绑定');

    // 初始化时获取统计信息
    getCheckboxInfo();

    // 循环全选功能
    async function autoLoopSelectAll() {
        const maxLoops = 20;
        let loopCount = 0;
        
        console.log(`[POPUP] 🔄 开始循环全选，最大循环次数: ${maxLoops}`);
        
        while (loopCount < maxLoops) {
            loopCount++;
            console.log(`\n[POPUP] === 第 ${loopCount} 次循环 ===`);
            
            // 执行全选
            await batchOperateCheckboxes('select');
            
            // 等待一下让页面响应
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 重新获取最新的页面状态
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const checkboxes = document.querySelectorAll('input.cds--checkbox');
                    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                    return { total: checkboxes.length, checked: checked };
                }
            });
            
            if (results && results[0]) {
                const { total, checked } = results[0].result;
                const unchecked = total - checked;
                console.log(`[POPUP] 📊 检查结果: 总数=${total}, 已勾选=${checked}, 未勾选=${unchecked}`);
                
                // 如果还有未勾选的，直接继续循环（滚动+再次全选）
                if (unchecked > 0) {
                    console.log(`[POPUP] ⚠️ 发现 ${unchecked} 个未勾选的复选框，继续循环...`);
                    
                    // 如果不是最后一次，滚动页面加载更多
                    if (loopCount < maxLoops) {
                        console.log(`[POPUP] 📜 滚动页面加载更多...`);
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                window.scrollBy(0, window.innerHeight * 0.8);
                            }
                        });
                        
                        // 等待滚动和加载完成
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }
                    continue; // 直接进入下一次循环
                }
                
                // 如果全部勾选了，进行5次验证确认
                if (checked === total && total > 0) {
                    console.log(`[POPUP] ✅ 检测到所有复选框已勾选，开始验证确认...`);
                    
                    const maxRetries = 5;
                    let confirmed = false;
                    
                    for (let i = 1; i <= maxRetries; i++) {
                        console.log(`\n[POPUP] 🔍 === 第 ${i} 次验证检查 ===`);
                        console.log(`[POPUP] ⏱️ 等待1秒后进行第 ${i} 次验证...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // 重新获取最新状态
                        const retryResults = await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                const checkboxes = document.querySelectorAll('input.cds--checkbox');
                                const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                                return { total: checkboxes.length, checked: checked };
                            }
                        });
                        
                        if (retryResults && retryResults[0]) {
                            const { total: retryTotal, checked: retryChecked } = retryResults[0].result;
                            const retryUnchecked = retryTotal - retryChecked;
                            console.log(`[POPUP] 📊 第 ${i} 次验证结果: 总数=${retryTotal}, 已勾选=${retryChecked}, 未勾选=${retryUnchecked}`);
                            
                            // 如果仍然全部勾选，继续下一次验证
                            if (retryChecked === retryTotal && retryTotal > 0) {
                                console.log(`[POPUP] ✅ 第 ${i} 次验证通过：仍然全部勾选`);
                                
                                // 如果是最后一次验证，确认结束
                                if (i === maxRetries) {
                                    console.log(`[POPUP] ✅ 验证完成：连续${maxRetries}次确认全部勾选`);
                                    console.log(`[POPUP] 📊 最终结果: 共循环 ${loopCount} 次，已勾选 ${retryChecked}/${retryTotal} 个复选框`);
                                    confirmed = true;
                                    break;
                                }
                                continue; // 继续下一次验证
                            }
                            
                            // 如果发现还有未勾选的，说明状态变化了，继续外层循环
                            if (retryUnchecked > 0) {
                                console.log(`[POPUP] ⚠️ 验证发现 ${retryUnchecked} 个未勾选的复选框，继续循环处理`);
                                break; // 跳出验证循环，继续外层循环
                            }
                        }
                    }
                    
                    // 如果验证确认完成，退出
                    if (confirmed) {
                        break;
                    }
                    // 否则继续外层循环
                }
            }
        }
        
        if (loopCount >= maxLoops) {
            console.log(`[POPUP] ⚠️ 已达到最大循环次数 ${maxLoops}`);
        }
        
        // 最后刷新统计
        setTimeout(getCheckboxInfo, 200);
    }
    
    // 循环取消全选功能
    async function autoLoopDeselectAll() {
        const maxLoops = 20;
        let loopCount = 0;
        
        console.log(`[POPUP] 🔄 开始循环取消全选，最大循环次数: ${maxLoops}`);
        
        while (loopCount < maxLoops) {
            loopCount++;
            console.log(`\n[POPUP] === 第 ${loopCount} 次循环 ===`);
            
            // 执行取消全选
            await batchOperateCheckboxes('deselect');
            
            // 等待一下让页面响应
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 重新获取最新的页面状态
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const checkboxes = document.querySelectorAll('input.cds--checkbox');
                    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                    return { total: checkboxes.length, checked: checked };
                }
            });
            
            if (results && results[0]) {
                const { total, checked } = results[0].result;
                console.log(`[POPUP] 📊 检查结果: 总数=${total}, 已勾选=${checked}, 待取消=${checked}`);
                
                // 如果还有已勾选的，直接继续循环（滚动+再次取消全选）
                if (checked > 0) {
                    console.log(`[POPUP] ⚠️ 发现 ${checked} 个已勾选的复选框，继续循环...`);
                    
                    // 如果不是最后一次，滚动页面加载更多
                    if (loopCount < maxLoops) {
                        console.log(`[POPUP] 📜 滚动页面加载更多...`);
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                window.scrollBy(0, window.innerHeight * 0.8);
                            }
                        });
                        
                        // 等待滚动和加载完成
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }
                    continue; // 直接进入下一次循环
                }
                
                // 如果全部取消勾选了，进行5次验证确认
                if (checked === 0) {
                    console.log(`[POPUP] ✅ 检测到所有复选框已取消勾选，开始验证确认...`);
                    
                    const maxRetries = 5;
                    let confirmed = false;
                    
                    for (let i = 1; i <= maxRetries; i++) {
                        console.log(`\n[POPUP] 🔍 === 第 ${i} 次验证检查 ===`);
                        console.log(`[POPUP] ⏱️ 等待1秒后进行第 ${i} 次验证...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // 重新获取最新状态
                        const retryResults = await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                const checkboxes = document.querySelectorAll('input.cds--checkbox');
                                const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
                                return { total: checkboxes.length, checked: checked };
                            }
                        });
                        
                        if (retryResults && retryResults[0]) {
                            const { total: retryTotal, checked: retryChecked } = retryResults[0].result;
                            console.log(`[POPUP] 📊 第 ${i} 次验证结果: 总数=${retryTotal}, 已勾选=${retryChecked}, 已取消=${retryTotal - retryChecked}`);
                            
                            // 如果仍然全部取消勾选，继续下一次验证
                            if (retryChecked === 0) {
                                console.log(`[POPUP] ✅ 第 ${i} 次验证通过：仍然全部取消勾选`);
                                
                                // 如果是最后一次验证，确认结束
                                if (i === maxRetries) {
                                    console.log(`[POPUP] ✅ 验证完成：连续${maxRetries}次确认全部取消勾选`);
                                    console.log(`[POPUP] 📊 最终结果: 共循环 ${loopCount} 次，已取消 ${retryTotal}/${retryTotal} 个复选框`);
                                    confirmed = true;
                                    break;
                                }
                                continue; // 继续下一次验证
                            }
                            
                            // 如果发现还有已勾选的，说明状态变化了，继续外层循环
                            if (retryChecked > 0) {
                                console.log(`[POPUP] ⚠️ 验证发现 ${retryChecked} 个已勾选的复选框，继续循环处理`);
                                break; // 跳出验证循环，继续外层循环
                            }
                        }
                    }
                    
                    // 如果验证确认完成，退出
                    if (confirmed) {
                        break;
                    }
                    // 否则继续外层循环
                }
            }
        }
        
        if (loopCount >= maxLoops) {
            console.log(`[POPUP] ⚠️ 已达到最大循环次数 ${maxLoops}`);
        }
        
        // 最后刷新统计
        setTimeout(getCheckboxInfo, 200);
    }

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

});