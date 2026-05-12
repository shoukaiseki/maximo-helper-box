// 在浏览器控制台中运行此代码来测试复选框操作

console.log('========== 开始测试复选框操作 ==========');

// 测试1：检查复选框
const cdsCheckboxes = document.querySelectorAll('input.cds--checkbox');
const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

console.log('CDS复选框数量:', cdsCheckboxes.length);
console.log('所有复选框数量:', allCheckboxes.length);

// 测试2：使用我们的方法勾选所有CDS复选框
console.log('\n开始勾选所有CDS复选框...');

cdsCheckboxes.forEach((checkbox, index) => {
    console.log(`\n处理第 ${index + 1} 个复选框:`);
    console.log('  - 当前状态:', checkbox.checked);
    console.log('  - ID:', checkbox.id);
    
    // 如果已经勾选，跳过
    if (checkbox.checked) {
        console.log('  - 已勾选，跳过');
        return;
    }
    
    try {
        // 使用原生 setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 
            'checked'
        ).set;
        
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(checkbox, true);
            console.log('  - ✓ 使用原生 setter 设置成功');
        } else {
            checkbox.checked = true;
            console.log('  - ✓ 直接设置成功');
        }
        
        console.log('  - 设置后状态:', checkbox.checked);
        
        // 触发事件
        checkbox.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        checkbox.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        checkbox.dispatchEvent(new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true,
            view: window
        }));
        
        console.log('  - ✓ 事件已触发');
        
        // 触发父元素事件
        if (checkbox.parentElement) {
            checkbox.parentElement.dispatchEvent(new Event('click', { 
                bubbles: true, 
                cancelable: true 
            }));
            console.log('  - ✓ 父元素事件已触发');
        }
        
    } catch (error) {
        console.error('  - ✗ 失败:', error);
    }
});

console.log('\n========== 测试完成 ==========');
console.log('请检查页面上的复选框是否都被勾选了！');

// 等待2秒后检查状态
setTimeout(() => {
    console.log('\n2秒后检查状态:');
    let checkedCount = 0;
    cdsCheckboxes.forEach((cb, i) => {
        if (cb.checked) checkedCount++;
        console.log(`复选框 ${i + 1}:`, cb.checked ? '✓ 已勾选' : '✗ 未勾选');
    });
    console.log(`总计: ${checkedCount}/${cdsCheckboxes.length} 已勾选`);
}, 2000);
