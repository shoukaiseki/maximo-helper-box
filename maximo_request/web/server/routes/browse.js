import { Router } from 'express';
import { execFile } from 'child_process';

export const browseRouter = Router();

// 用文件选择框实现目录选择：进入目标目录后点"打开"，返回当前目录
const PS_SCRIPT = `Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.OpenFileDialog; $d.ValidateNames = $false; $d.CheckFileExists = $false; $d.CheckPathExists = $true; $d.FileName = '选择此目录'; $d.Title = '进入目标目录后点击[打开]选择该目录'; if ($d.ShowDialog() -eq 'OK') { [System.IO.Path]::GetDirectoryName($d.FileName) }`;

/**
 * POST /api/browse-dir
 * 弹出 Windows 目录选择对话框，返回选中路径
 */
browseRouter.post('/dir', (req, res) => {
  if (process.platform !== 'win32') {
    return res.status(400).json({ success: false, message: '仅支持 Windows 系统' });
  }
  execFile('powershell.exe', ['-NoProfile', '-Command', PS_SCRIPT], (err, stdout) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    const selected = String(stdout).trim();
    res.json({ success: true, path: selected || null });
  });
});
