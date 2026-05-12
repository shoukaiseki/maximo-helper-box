const fs = require('fs');
const { createCanvas } = require('canvas');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#007cba';
    ctx.beginPath();
    const radius = size * 0.125;
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    
    // 绘制复选框
    const boxSize = size * 0.25;
    const spacing = size * 0.15;
    const startX = size * 0.15;
    
    for (let i = 0; i < 3; i++) {
        const y = spacing + i * (boxSize + spacing * 0.5);
        
        // 复选框边框
        ctx.strokeStyle = 'white';
        ctx.lineWidth = Math.max(1, size * 0.02);
        ctx.strokeRect(startX, y, boxSize, boxSize);
        
        // 勾选标记
        ctx.beginPath();
        ctx.moveTo(startX + boxSize * 0.2, y + boxSize * 0.5);
        ctx.lineTo(startX + boxSize * 0.4, y + boxSize * 0.7);
        ctx.lineTo(startX + boxSize * 0.8, y + boxSize * 0.3);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = Math.max(1, size * 0.025);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    
    return canvas.toBuffer('image/png');
}

// 生成不同尺寸的图标
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const buffer = drawIcon(size);
    fs.writeFileSync(`icons/icon${size}.png`, buffer);
    console.log(`Generated icon${size}.png`);
});

console.log('All icons generated successfully!');
