import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const scanRouter = Router();

/**
 * POST /api/scan
 * 按目录/扩展名/递归参数扫描文件
 */
scanRouter.post('/', (req, res) => {
  try {
    const { dirPath, extFilter = '.json', recursive = false } = req.body;
    
    if (!dirPath) {
      return res.status(400).json({
        success: false,
        message: '目录路径不能为空'
      });
    }
    
    if (!fs.existsSync(dirPath)) {
      return res.status(404).json({
        success: false,
        message: `目录不存在: ${dirPath}`
      });
    }
    
    const files = scanFiles(dirPath, extFilter, recursive);
    
    res.json({
      success: true,
      data: {
        dirPath,
        extFilter,
        recursive,
        files,
        total: files.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 扫描目录文件
 */
function scanFiles(dirPath, extFilter, recursive) {
  const results = [];
  
  function scan(currentPath, depth = 0) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isFile()) {
        if (entry.name.toLowerCase().endsWith(extFilter.toLowerCase())) {
          results.push({
            name: entry.name,
            path: fullPath,
            relativePath: path.relative(dirPath, fullPath),
            size: fs.statSync(fullPath).size
          });
        }
      } else if (entry.isDirectory() && recursive && depth < 10) {
        scan(fullPath, depth + 1);
      }
    }
  }
  
  scan(dirPath);
  return results;
}
