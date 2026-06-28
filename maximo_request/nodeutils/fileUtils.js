import fs from 'fs';
import path from 'path';
import { getWorkDir } from './config.js';

/**
 * 根据文件名获取文件路径
 * @param {string} fileNameIn - 文件名（可以是相对路径或绝对路径）
 * @returns {string} 文件路径
 */
function filePathForName(fileNameIn) {
  var fileName = fileNameIn.replace(/\\/g, '/');

  // 如果是绝对路径，直接返回
  if (path.isAbsolute(fileName)) {
    return fileName;
  }

  // 如果是相对路径，使用当前工作目录
  const workDir = getWorkDir();
  return path.join(workDir, fileName);
}

/**
 * 根据文件名读取文件内容
 * @param {string} fileName - 文件名（可以是相对路径或绝对路径）
 * @param {string} encoding - 文件编码，默认 'utf-8'
 * @returns {string|null} 文件内容，如果文件不存在返回 null
 */
function readFileContent(fileName, encoding = 'utf-8') {
  const filePath = filePathForName(fileName);
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, encoding);
    return content;
  } catch (error) {
    console.error(`读取文件失败: ${fileName}`, error.message);
    return null;
  }
}

/**
 * 根据文件名读取JSON文件并解析
 * @param {string} fileName - JSON文件名
 * @returns {object|null} 解析后的JSON对象，如果失败返回 null
 */
function readJsonFile(fileName) {
  const content = readFileContent(fileName);
  try {
    if (!content) {
      return null;
    }
    const jsonData = JSON.parse(content);
    return jsonData;
  } catch (error) {
    console.error(`解析JSON文件失败: ${fileName}`, error.message);
    return null;
  }
}

/**
 * 根据文件名读取XML文件
 * @param {string} fileName - XML文件名
 * @returns {string|null} XML文件内容
 */
function readXmlFile(fileName) {
  return readFileContent(fileName, 'utf-8');
}

/**
 * 检查文件是否存在
 * @param {string} fileNameIn - 文件名
 * @returns {boolean} 文件是否存在
 */
function fileExists(fileNameIn) {
  try {
    var fileName = fileNameIn.replace(/\\/g, '/');

    // 如果是绝对路径，直接检查
    if (path.isAbsolute(fileName)) {
      return fs.existsSync(fileName);
    }

    // 如果是相对路径，使用当前工作目录
    const filePath = path.join(getWorkDir(), fileName);
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

export {
  readFileContent,
  readJsonFile,
  readXmlFile,
  fileExists
};
