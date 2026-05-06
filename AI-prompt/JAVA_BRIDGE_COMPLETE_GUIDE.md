# Java Bridge 完整使用指南

## 📋 目录

- [概述](#概述)
- [🚀 快速开始](#-快速开始)
- [环境要求](#环境要求)
- [安装与配置](#安装与配置)
- [核心 API](#核心-api)
- [初始化流程](#初始化流程)
- [JAR 包加载策略](#jar-包加载策略)
- [类加载机制](#类加载机制)
- [常见问题与解决方案](#常见问题与解决方案)
- [💡 调试技巧](#-调试技巧)
- [最佳实践](#最佳实践)
- [⚠️ 安全注意事项](#️-安全注意事项)
- [📊 实战案例：test-extract-reflection.js 开发历程](#-实战案例test-extract-reflectionjs-开发历程)

---

## 概述

`java-bridge` 是一个 Node.js 模块，用于在 Node.js 环境中调用 Java 代码。它通过 JNI（Java Native Interface）桥接 Node.js 和 JVM，使得 JavaScript 可以直接访问 Java 类和对象。

**本项目中的应用场景：**
- Maximo 脚本编辑器的代码补全功能（模式3：Java反射）
- 动态获取 Maximo API 方法列表
- 提取类的反射信息用于开发辅助

**版本信息：**
- java-bridge: 2.8.1
- Electron: 28.0.0
- 最低 Java 版本: **Java 9+**（重要！）

---

## 🚀 快速开始

### 5分钟上手指南

#### 步骤 1：安装依赖
```bash
npm install java-bridge
```

#### 步骤 2：配置 Java 环境

创建 `reflection-config/java-config.json`：
```json
{
  "jvmPath": "D:\\usr\\java\\jdk-17.0.19x64\\bin\\server\\jvm.dll",
  "jarDirectory": "E:\\gitwork\\maximo9.1\\maximolib",
  "additionalJars": []
}
```

**如何找到 jvm.dll？**
- Windows: `<JDK安装目录>\bin\server\jvm.dll`
- macOS: `<JDK安装目录>/lib/server/libjvm.dylib`
- Linux: `<JDK安装目录>/lib/server/libjvm.so`

#### 步骤 3：运行测试脚本
```bash
npm run test:extract-reflection
```

#### 步骤 4：查看结果
提取的反射数据保存在 `reflection-data/` 目录：
```
reflection-data/
├── psdi-mbo-MboRemote.json          (179 个方法)
├── psdi-mbo-MboSetRemote.json       (256 个方法)
├── com-ibm-ism-script-ScriptService.json  (45 个方法)
└── ...
```

#### 步骤 5：验证成功
看到以下输出表示成功：
```
✓ URLClassLoader 设置成功
✓ 通过 URLClassLoader 加载成功
✓ 已保存: psdi-mbo-MboRemote.json (179 个方法)
✨ 完成！
```

---

## 环境要求

### 1. Java 运行时环境

⚠️ **关键要求：必须使用 Java 9 或更高版本**

```bash
# 检查 Java 版本
java -version
```

**原因：** `java-bridge@2.8.1` 是用 Java 9 编译的（class file version 53.0），无法在 Java 8（version 52.0）上运行。

**推荐版本：**
- ✅ Java 11 LTS
- ✅ Java 17 LTS（本项目使用）
- ❌ Java 8（不支持）

### 2. 操作系统依赖

**Windows:**
- Visual C++ Redistributable for Visual Studio 2015
- 下载地址：https://www.microsoft.com/zh-cn/download/details.aspx?id=48145

**macOS/Linux:**
- 通常无需额外依赖

### 3. Node.js 版本

- Node.js 16+（支持 ES Module 动态导入）

---

## 安装与配置

### 1. 安装 java-bridge

```bash
npm install java-bridge
```

### 2. Electron 打包配置

由于 `java-bridge` 包含原生二进制文件，必须在 `package.json` 中配置 `asarUnpack`：

```json
{
  "build": {
    "asarUnpack": [
      "node_modules/java-bridge/**",
      "node_modules/java-bridge-*/*"
    ]
  }
}
```

**原因：** Electron 打包时会将代码压缩到 `app.asar` 文件中，但原生模块（`.node`、`.dll`、`.dylib`、`.so`）必须解压出来才能被正确加载。

### 3. Java 环境配置

#### 方式一：自动检测（推荐）

如果系统只有一个 Java 版本，或者默认 Java 版本满足要求，可以留空配置，让 `java-bridge` 自动检测。

#### 方式二：指定 JVM 路径

当系统有多个 Java 版本，或需要特定版本时，可以通过配置文件指定：

**配置文件位置：**
- Windows: `%APPDATA%\maximo-script-manager\java-config.json`
- macOS: `~/Library/Application Support/maximo-script-manager/java-config.json`
- Linux: `~/.config/maximo-script-manager/java-config.json`

**配置格式：**
```json
{
  "jvmPath": "D:\\usr\\java\\jdk-17.0.19x64\\bin\\server\\jvm.dll",
  "jarDirectory": "E:\\gitwork\\maximo9.1\\maximolib",
  "additionalJars": [],
  "selectedClasses": [
    "psdi.mbo.MboRemote",
    "psdi.mbo.MboSetRemote"
  ]
}
```

**字段说明：**
- `jvmPath`: JVM 动态库的完整路径（可选）
  - Windows: `jvm.dll`
  - macOS: `libjvm.dylib`
  - Linux: `libjvm.so`
- `jarDirectory`: 包含 JAR 文件的目录，会自动扫描该目录下所有 `.jar` 文件
- `additionalJars`: 额外的 JAR 文件路径数组
- `selectedClasses`: 需要反射的类列表（用于代码补全）

---

## 核心 API

### 1. 动态导入模块

```javascript
// ES Module 方式（推荐）
const javaBridgeModule = await import('java-bridge');
const javaBridge = javaBridgeModule.default || javaBridgeModule;

// CommonJS 方式（不推荐，可能有问题）
const javaBridge = require('java-bridge');
```

⚠️ **注意：** 由于 `java-bridge` 是 ES Module，使用动态导入时必须获取 `default` 导出。

### 2. ensureJvm(options)

启动 JVM 虚拟机。

**参数：**
```javascript
{
  isPackagedElectron: boolean,  // 是否为打包后的 Electron 应用
  libPath?: string,             // JVM 动态库路径（可选）
  opts?: string[]               // JVM 启动参数
}
```

**示例：**
```javascript
await javaBridge.ensureJvm({
  isPackagedElectron: app.isPackaged,
  libPath: 'D:\\usr\\java\\jdk-17\\bin\\server\\jvm.dll',  // 可选
  opts: [
    '-Xms256m',           // 初始堆内存
    '-Xmx512m',           // 最大堆内存
    '-Dfile.encoding=UTF-8'  // 文件编码
  ]
});
```

**重要特性：**
- ✅ 只能调用一次，重复调用会返回已初始化的实例
- ✅ 必须在调用其他 API 之前完成
- ⚠️ **JVM 启动后无法更改 classpath**（需要使用 URLClassLoader 动态加载）

### 3. importClass(className)

导入 Java 类并返回代理对象。

**参数：**
- `className`: Java 类的全限定名，如 `'java.lang.String'`

**返回值：**
- Java 类的代理对象，可以调用其静态方法和构造函数

**示例：**
```javascript
const String = javaBridge.importClass('java.lang.String');
const str = new String('Hello World');
console.log(str.lengthSync());  // 11

const System = javaBridge.importClass('java.lang.System');
const version = System.getPropertySync('java.version');
console.log(version);  // "17.0.19"
```

**命名约定：**
- 同步方法后缀为 `Sync`，如 `getPropertySync()`
- 异步方法没有后缀（较少使用）

### 4. appendClasspath(jars)

向 classpath 添加 JAR 文件。

**参数：**
- `jars`: 字符串或字符串数组，JAR 文件的路径

**示例：**
```javascript
javaBridge.appendClasspath([
  'E:\\maximo\\lib\\businessobjects.jar',
  'E:\\maximo\\lib\\mbojava.jar'
]);
```

⚠️ **重要限制：**
- 此方法在某些版本的 `java-bridge` 中**可能不起作用**
- 即使调用成功，`System.getProperty('java.class.path')` 可能仍然为空
- **推荐使用 URLClassLoader 作为替代方案**（见下文）

---

## 初始化流程

### 标准初始化顺序

```
1. 加载配置文件
   ↓
2. 动态导入 java-bridge 模块
   ↓
3. 验证 API 是否存在
   ↓
4. 准备 JVM 选项（包括 libPath）
   ↓
5. 调用 ensureJvm() 启动 JVM
   ↓
6. 扫描并收集 JAR 文件列表
   ↓
7. 尝试 appendClasspath()（可能失败）
   ↓
8. 使用 URLClassLoader 动态加载 JAR（备用方案）
   ↓
9. 设置线程上下文 ClassLoader
   ↓
10. 验证 Java 环境信息
```

### 完整代码示例

```javascript
async function initializeJavaBridge() {
  try {
    // 1. 防止重复初始化
    if (javaBridge) {
      console.log('Java Bridge 已经初始化');
      return true;
    }
    
    // 2. 动态导入模块
    const javaBridgeModule = await import('java-bridge');
    javaBridge = javaBridgeModule.default || javaBridgeModule;
    
    // 3. 验证关键 API
    if (typeof javaBridge.ensureJvm !== 'function') {
      throw new Error('javaBridge.ensureJvm 不是函数');
    }
    if (typeof javaBridge.importClass !== 'function') {
      throw new Error('javaBridge.importClass 不是函数');
    }
    
    // 4. 准备 JVM 选项
    const jvmOptions = {
      isPackagedElectron: app.isPackaged,
      opts: ['-Xms256m', '-Xmx512m', '-Dfile.encoding=UTF-8']
    };
    
    // 如果配置了自定义 JVM 路径
    if (javaConfig.jvmPath) {
      jvmOptions.libPath = javaConfig.jvmPath;
      console.log(`使用自定义 JVM: ${javaConfig.jvmPath}`);
    }
    
    // 5. 启动 JVM
    console.log('正在启动 JVM...');
    await javaBridge.ensureJvm(jvmOptions);
    console.log('✓ JVM 启动成功');
    
    // 6. 扫描 JAR 文件
    const allJars = [];
    
    // 从配置的目录扫描
    if (javaConfig.jarDirectory) {
      const dirJars = scanJarDirectory(javaConfig.jarDirectory);
      allJars.push(...dirJars);
    }
    
    // 添加额外的 JAR 文件
    if (javaConfig.additionalJars && Array.isArray(javaConfig.additionalJars)) {
      const validJars = javaConfig.additionalJars.filter(jar => 
        require('fs').existsSync(jar)
      );
      allJars.push(...validJars);
    }
    
    // 7-9. 加载 JAR 到 classpath
    if (allJars.length > 0) {
      console.log(`添加 ${allJars.length} 个 JAR 到 classpath`);
      
      // 方法1: 尝试 appendClasspath
      try {
        javaBridge.appendClasspath(allJars);
        console.log('✓ appendClasspath 调用成功');
      } catch (e) {
        console.warn('appendClasspath 失败:', e.message);
      }
      
      // 方法2: 使用 URLClassLoader（推荐）
      try {
        const URL = javaBridge.importClass('java.net.URL');
        const URLClassLoader = javaBridge.importClass('java.net.URLClassLoader');
        const ClassLoader = javaBridge.importClass('java.lang.ClassLoader');
        const Thread = javaBridge.importClass('java.lang.Thread');
        
        const systemClassLoader = ClassLoader.getSystemClassLoaderSync();
        
        // 将 JAR 路径转换为 URL 数组
        const urls = allJars.map(jar => new URL(`file:${jar.replace(/\\/g, '/')}`));
        
        // 创建 URLClassLoader
        const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
        
        // 设置线程上下文 ClassLoader（关键步骤！）
        Thread.currentThreadSync().setContextClassLoaderSync(urlClassLoader);
        
        console.log('✓ URLClassLoader 设置成功');
      } catch (e) {
        console.error('URLClassLoader 设置失败:', e.message);
        throw e;
      }
    }
    
    // 10. 验证 Java 环境
    const System = javaBridge.importClass('java.lang.System');
    const javaVersion = System.getPropertySync('java.version');
    console.log(`Java 版本: ${javaVersion}`);
    
    return true;
  } catch (e) {
    console.error('Java Bridge 初始化失败:', e.message);
    console.error(e.stack);
    return false;
  }
}

// 扫描目录下的 JAR 文件
function scanJarDirectory(directory) {
  const jars = [];
  
  if (!directory || !require('fs').existsSync(directory)) {
    return jars;
  }
  
  const files = require('fs').readdirSync(directory);
  files.forEach(file => {
    if (file.endsWith('.jar')) {
      const jarPath = require('path').join(directory, file);
      jars.push(jarPath);
    }
  });
  
  return jars;
}
```

---

## JAR 包加载策略

### 问题背景

`java-bridge` 的 `appendClasspath()` 方法在某些情况下**不会真正将 JAR 添加到 classpath**。即使调用成功，`System.getProperty('java.class.path')` 可能返回空字符串或很短的内容。

### 解决方案：URLClassLoader

使用 Java 的 `URLClassLoader` 动态加载 JAR 文件，这是**最可靠的方法**。

#### 步骤详解

**1. 导入必要的 Java 类**
```javascript
const URL = javaBridge.importClass('java.net.URL');
const URLClassLoader = javaBridge.importClass('java.net.URLClassLoader');
const ClassLoader = javaBridge.importClass('java.lang.ClassLoader');
const Thread = javaBridge.importClass('java.lang.Thread');
```

**2. 获取系统 ClassLoader**
```javascript
const systemClassLoader = ClassLoader.getSystemClassLoaderSync();
```

**3. 将 JAR 路径转换为 URL 数组**
```javascript
const urls = allJars.map(jar => new URL(`file:${jar.replace(/\\/g, '/')}`));
```

⚠️ **重要：** Windows 路径必须将反斜杠 `\` 转换为正斜杠 `/`，否则 URL 解析会失败。

**4. 创建 URLClassLoader**
```javascript
const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
```

**5. 设置线程上下文 ClassLoader**
```javascript
Thread.currentThreadSync().setContextClassLoaderSync(urlClassLoader);
```

这一步**至关重要**！如果不设置上下文 ClassLoader，后续通过 `contextClassLoader.loadClassSync()` 将无法找到自定义 JAR 中的类。

### 两种创建 URLClassLoader 的方式

#### 方式1：直接传入 JavaScript 数组（推荐）

```javascript
const urls = allJars.map(jar => new URL(`file:${jar}`));
const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
```

大多数情况下这种方式可以正常工作。

#### 方式2：使用 Java 数组（备用）

如果方式1失败，可以尝试使用 Java 数组：

```javascript
const URLArray = javaBridge.importClass('[Ljava.net.URL;');
const urlArray = new URLArray(urls.length);
for (let i = 0; i < urls.length; i++) {
  urlArray[i] = urls[i];
}
const urlClassLoader = new URLClassLoader(urlArray, systemClassLoader);
```

---

## 类加载机制

### 类加载优先级

当使用 URLClassLoader 设置上下文 ClassLoader 后，类加载的优先级如下：

1. **线程上下文 ClassLoader**（最高优先级）
   - 通过 `contextClassLoader.loadClassSync(className)` 加载
   - 可以加载 URLClassLoader 中添加的所有 JAR 中的类

2. **系统 ClassLoader**
   - 通过 `Class.forNameSync(className)` 加载
   - 只能加载系统 classpath 中的类（通常是 JDK 标准库）

### 推荐的类加载方式

#### 方式1：使用上下文 ClassLoader（推荐）

```javascript
const Thread = javaBridge.importClass('java.lang.Thread');
const contextClassLoader = Thread.currentThreadSync().getContextClassLoaderSync();

try {
  const clazz = contextClassLoader.loadClassSync('psdi.mbo.MboRemote');
  console.log('✓ 类加载成功');
} catch (e) {
  console.error('✗ 类加载失败:', e.message);
}
```

**优点：**
- ✅ 可以加载自定义 JAR 中的类
- ✅ 性能较好
- ✅ 符合 Java 类加载规范

#### 方式2：回退到 Class.forName

```javascript
const Class = javaBridge.importClass('java.lang.Class');

try {
  const clazz = Class.forNameSync('psdi.mbo.MboRemote');
  console.log('✓ 类加载成功');
} catch (e) {
  console.error('✗ 类加载失败:', e.message);
}
```

**缺点：**
- ❌ 只能加载系统 classpath 中的类
- ❌ 无法加载动态添加的 JAR 中的类

#### 方式3：双重回退策略（最佳实践）

```javascript
const Class = javaBridge.importClass('java.lang.Class');
const Thread = javaBridge.importClass('java.lang.Thread');

let clazz;

try {
  // 优先使用上下文 ClassLoader
  const contextClassLoader = Thread.currentThreadSync().getContextClassLoaderSync();
  clazz = contextClassLoader.loadClassSync(className);
  console.log('✓ 通过 URLClassLoader 加载成功');
} catch (e1) {
  console.warn(`URLClassLoader 加载失败，尝试 Class.forName: ${e1.message}`);
  
  // 回退到 Class.forName
  try {
    clazz = Class.forNameSync(className);
    console.log('✓ 通过 Class.forName 加载成功');
  } catch (e2) {
    console.error(`两种方式都失败: ${e2.message}`);
    throw e2;
  }
}
```

---

## 常见问题与解决方案

### Q1: UnsupportedClassVersionError

**错误信息：**
```
java.lang.UnsupportedClassVersionError: io/github/markusjx/bridge/NativeLibrary 
has been compiled by a more recent version of the Java Runtime 
(class file version 53.0), this version of the Java Runtime only recognizes 
class file versions up to 52.0
```

**原因：** 使用了 Java 8，但 `java-bridge` 需要 Java 9+。

**解决方案：**
1. 安装 Java 11 或 Java 17
2. 在配置文件中指定 JVM 路径：
   ```json
   {
     "jvmPath": "D:\\usr\\java\\jdk-17.0.19x64\\bin\\server\\jvm.dll"
   }
   ```

### Q2: ClassNotFoundException

**错误信息：**
```
java.lang.ClassNotFoundException: psdi/mbo/MboRemote
```

**可能原因：**
1. JAR 文件未正确加载到 classpath
2. 使用了 `Class.forName()` 而不是上下文 ClassLoader
3. JAR 文件路径错误或文件不存在

**解决方案：**
1. 确认使用了 URLClassLoader 并设置了上下文 ClassLoader
2. 验证 JAR 文件确实存在且包含目标类：
   ```bash
   jar tf businessobjects.jar | findstr "MboRemote.class"
   ```
3. 检查日志输出，确认 URLClassLoader 创建成功

### Q3: appendClasspath 调用成功但 classpath 为空

**现象：**
```
✓ appendClasspath 调用成功
Classpath 长度: 0 字符
```

**原因：** `java-bridge` 的 `appendClasspath` 实现可能不完整或有 bug。

**解决方案：** 直接使用 URLClassLoader，不要依赖 `appendClasspath`。

### Q4: Windows 路径问题

**错误信息：**
```
java.net.MalformedURLException: no protocol: E:\path\to\file.jar
```

**原因：** Windows 路径中的反斜杠 `\` 未被正确转义。

**解决方案：**
```javascript
// 错误
const url = new URL(`file:${jar}`);

// 正确
const url = new URL(`file:${jar.replace(/\\/g, '/')}`);
```

### Q5: ES Module 导入问题

**错误信息：**
```
TypeError: javaBridge.ensureJvm is not a function
```

**原因：** 动态导入后未获取 `default` 导出。

**解决方案：**
```javascript
// 错误
const javaBridge = await import('java-bridge');

// 正确
const javaBridgeModule = await import('java-bridge');
const javaBridge = javaBridgeModule.default || javaBridgeModule;
```

### Q6: Electron 打包后无法使用

**现象：** 开发环境正常，打包后报错找不到模块。

**原因：** 原生模块被打包到 `app.asar` 中，无法被正确加载。

**解决方案：** 在 `package.json` 中配置 `asarUnpack`：
```json
{
  "build": {
    "asarUnpack": [
      "node_modules/java-bridge/**",
      "node_modules/java-bridge-*/*"
    ]
  }
}
```

---

## 💡 调试技巧

### 1. 检查 JVM 是否启动成功

```javascript
const System = javaBridge.importClass('java.lang.System');
console.log('Java 版本:', System.getPropertySync('java.version'));
console.log('Java Home:', System.getPropertySync('java.home'));
console.log('JVM 名称:', System.getPropertySync('java.vm.name'));
```

**预期输出：**
```
Java 版本: 17.0.19
Java Home: D:\usr\java\jdk-17.0.19x64
JVM 名称: OpenJDK 64-Bit Server VM
```

### 2. 检查 ClassLoader 状态

```javascript
const ClassLoader = javaBridge.importClass('java.lang.ClassLoader');
const systemCL = ClassLoader.getSystemClassLoaderSync();
console.log('系统 ClassLoader:', systemCL.toStringSync());

const Thread = javaBridge.importClass('java.lang.Thread');
const contextCL = Thread.currentThreadSync().getContextClassLoaderSync();
console.log('上下文 ClassLoader:', contextCL.toStringSync());
```

**关键点：**
- 如果两个 ClassLoader 相同，说明 URLClassLoader 未设置
- 上下文 ClassLoader 应该是 `java.net.URLClassLoader`

### 3. 验证 JAR 是否被加载

```javascript
// 尝试加载一个已知存在的类
try {
  const Thread = javaBridge.importClass('java.lang.Thread');
  const contextCL = Thread.currentThreadSync().getContextClassLoaderSync();
  
  const clazz = contextCL.loadClassSync('psdi.mbo.MboRemote');
  console.log('✓ MboRemote 加载成功');
  console.log('类名:', clazz.getNameSync());
  
  // 查看有哪些方法
  const methods = clazz.getMethodsSync();
  console.log(`共有 ${methods.length} 个公共方法`);
} catch (e) {
  console.error('✗ 加载失败:', e.message);
}
```

### 4. 查看完整的错误堆栈

```javascript
try {
  // 你的代码
} catch (e) {
  console.error('错误消息:', e.message);
  console.error('完整堆栈:', e.stack);  // 包含 Java 堆栈
}
```

**示例输出：**
```
错误消息: java.lang.ClassNotFoundException: psdi/mbo/MboRemote
完整堆栈: java.lang.ClassNotFoundException: psdi/mbo/MboRemote
    at java.base/java.net.URLClassLoader.findClass(URLClassLoader.java:445)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:592)
    at crates\java-rs\src\java\java_env_wrapper.rs:724
```

从堆栈可以看到是哪个 ClassLoader 抛出的异常。

### 5. 验证 JAR 文件内容

在运行脚本之前，先确认 JAR 文件中确实包含目标类：

**Windows:**
```bash
jar tf E:\maximo\lib\businessobjects.jar | findstr "MboRemote.class"
```

**Linux/macOS:**
```bash
jar tf /path/to/businessobjects.jar | grep "MboRemote.class"
```

**输出示例：**
```
psdi/mbo/MboRemote.class
psdi/mbo/MboRemote$1.class
psdi/mbo/MboRemote$MboRemoteIterator.class
```

如果找不到，说明该类不在这个 JAR 中，需要查找其他 JAR 文件。

### 6. 检查 classpath 长度

```javascript
const System = javaBridge.importClass('java.lang.System');
const classpath = System.getPropertySync('java.class.path');
console.log(`Classpath 长度: ${classpath ? classpath.length : 0} 字符`);

if (classpath && classpath.length > 100) {
  console.log('✓ Classpath 已设置');
} else {
  console.warn('⚠️ Classpath 可能未正确设置');
  console.warn('   但这不影响 URLClassLoader 的使用');
}
```

**注意：** 即使使用 URLClassLoader，`java.class.path` 属性也可能为空，这是正常的！

---

## 最佳实践

### 1. 配置管理

✅ **推荐：** 使用 JSON 配置文件管理 Java 环境设置

```json
{
  "jvmPath": "",  // 留空则自动检测
  "jarDirectory": "E:\\maximo\\lib",
  "additionalJars": [
    "E:\\custom\\my-library.jar"
  ],
  "selectedClasses": [
    "psdi.mbo.MboRemote",
    "psdi.mbo.MboSetRemote"
  ]
}
```

❌ **避免：** 硬编码路径

### 2. 错误处理

✅ **推荐：** 使用 try-catch 包裹所有 Java 调用

```javascript
try {
  const clazz = contextClassLoader.loadClassSync(className);
  // 处理类...
} catch (e) {
  console.error(`加载类 ${className} 失败:`, e.message);
  // 提供友好的错误提示
}
```

### 3. 日志记录

✅ **推荐：** 记录详细的初始化日志

```javascript
console.log('[Java Bridge] 开始初始化...');
console.log('[Java Bridge] JVM 路径:', javaConfig.jvmPath || '自动检测');
console.log('[Java Bridge] JAR 目录:', javaConfig.jarDirectory);
console.log('[Java Bridge] JAR 数量:', allJars.length);
```

### 4. 性能优化

✅ **推荐：** 缓存反射结果

```javascript
const methodCache = new Map();

async function getClassMethods(className) {
  if (methodCache.has(className)) {
    return methodCache.get(className);
  }
  
  const methods = await extractMethodsViaReflection(className);
  methodCache.set(className, methods);
  return methods;
}
```

### 5. 资源清理

⚠️ **注意：** JVM 一旦启动就无法关闭，直到 Node.js 进程退出。

- 不要在循环中重复调用 `ensureJvm()`
- 使用单例模式管理 java-bridge 实例

### 6. 线程安全

✅ **推荐：** 在主线程中初始化 java-bridge

```javascript
// main.js（主进程）
let javaBridge = null;

async function getJavaBridge() {
  if (!javaBridge) {
    await initializeJavaBridge();
  }
  return javaBridge;
}
```

❌ **避免：** 在渲染进程中直接使用

```javascript
// renderer.js（渲染进程）- 不推荐
const javaBridge = await import('java-bridge');  // ❌
```

应该通过 IPC 通信：

```javascript
// preload.js
getJavaClassMethods: (className) => ipcRenderer.invoke('get-java-class-methods', className)

// renderer.js
const result = await window.electronAPI.getJavaClassMethods('psdi.mbo.MboRemote');
```

### 7. 路径处理

✅ **推荐：** 统一使用正斜杠

```javascript
const normalizedPath = jarPath.replace(/\\/g, '/');
const url = new URL(`file:${normalizedPath}`);
```

### 8. 版本检查

✅ **推荐：** 启动时检查 Java 版本

```javascript
const System = javaBridge.importClass('java.lang.System');
const javaVersion = System.getPropertySync('java.version');
const majorVersion = parseInt(javaVersion.split('.')[0]);

if (majorVersion < 9) {
  throw new Error(`需要 Java 9+，当前版本: ${javaVersion}`);
}
```

### 9. 依赖管理

⚠️ **重要：** 当反射的类依赖其他库时，必须确保所有依赖都在 classpath 中。

**常见问题：**
```java
// UserInfo 类的方法可能返回 JSONObject
public JSONObject getUserInfo() { ... }

// 如果 json4j.jar 不在 classpath 中，会报错：
// ClassNotFoundException: com.ibm.json.java.JSONObject
```

**解决方案：**

1. **识别缺失的依赖**
   - 查看错误信息中的 `ClassNotFoundException`
   - 确定哪个类找不到（如 `com.ibm.json.java.JSONObject`）

2. **找到对应的 JAR 文件**
   - `com.ibm.json.*` → `json4j.jar`
   - `javax.mail.*` → `mail.jar` 或 `javax.mail.jar`
   - `com.hp.hpl.jena.*` → `jena-core.jar`, `jena-arq.jar` 等

3. **添加到配置中**
   ```json
   {
     "jarDirectory": "E:\\maximo\\lib",
     "additionalJars": [
       "E:\\maximo\\lib\\json4j.jar",
       "E:\\maximo\\lib\\mail.jar",
       "E:\\maximo\\lib\\jena-core.jar"
     ]
   }
   ```

4. **或者暂时移除有问题的类**
   ```json
   {
     "classes": [
       "psdi.mbo.MboRemote",  // ✓ 无外部依赖
       // "psdi.security.UserInfo"  // ✗ 需要 json4j.jar
     ]
   }
   ```

**实际案例：**

在 Maximo 9.1 环境中提取反射信息时，遇到以下依赖问题：

| 类 | 缺失的依赖 | 需要的 JAR |
|----|-----------|------------|
| `psdi.security.UserInfo` | `com.ibm.json.java.JSONObject` | `json4j.jar` |
| `psdi.server.MXServer` | `javax.mail.internet.AddressException` | `mail.jar` |
| `com.ibm.tivoli.maximo.oslc.OslcUtils` | `com.hp.hpl.jena.rdf.model.Property` | `jena-*.jar` |
| `com.ibm.json.java.JSONObject` | 类本身不存在 | `json4j.jar` |

**建议：**
- ✅ 先提取核心类（MboRemote、MboSetRemote 等），验证基本功能
- ✅ 逐步添加有依赖的类，并补充相应的 JAR 文件
- ✅ 使用 `jar tf xxx.jar | findstr "ClassName"` 验证 JAR 是否包含目标类

---

## ⚠️ 安全注意事项

### 1. JVM 无法关闭

⚠️ **重要：** 一旦调用 `ensureJvm()`，JVM 会一直运行直到 Node.js 进程退出。

**影响：**
- 不能在运行时切换 Java 版本
- 不能动态卸载已加载的 JAR
- 每个 Electron 应用只能有一个 JVM 实例

**建议：**
- 在应用启动时初始化一次
- 使用单例模式管理
- 不要在中途修改 `jvmPath`

### 2. 原生模块兼容性

`java-bridge` 包含平台特定的二进制文件：
- Windows: `.node` + `.dll`
- macOS: `.node` + `.dylib`
- Linux: `.node` + `.so`

**打包时必须配置 `asarUnpack`**，否则打包后的应用无法找到原生模块。

### 3. 路径安全性

避免在路径中使用用户输入，防止路径遍历攻击：

```javascript
// ❌ 危险
const userPath = userInput;
const url = new URL(`file:${userPath}`);

// ✅ 安全
const path = require('path');
const safePath = path.resolve(allowedDirectory, userInput);
if (!safePath.startsWith(allowedDirectory)) {
  throw new Error('非法路径');
}
const url = new URL(`file:${safePath.replace(/\\/g, '/')}`);
```

### 4. 错误信息泄露

Java 异常堆栈可能包含敏感信息（如文件路径、类名等）：

```javascript
// ❌ 直接返回完整堆栈给前端
return { error: e.stack };

// ✅ 只返回简化的错误消息
return { 
  error: `加载类失败: ${e.message.split('\n')[0]}` 
};
```

---

## 📊 实战案例：test-extract-reflection.js 开发历程

本节记录了开发 `test-extract-reflection.js` 脚本时遇到的真实问题和解决方案，作为反面教材供参考。

### 问题 1：Java 版本不兼容

**现象：**
```
java.lang.UnsupportedClassVersionError: io/github/markusjx/bridge/NativeLibrary 
has been compiled by a more recent version of the Java Runtime 
(class file version 53.0), this version of the Java Runtime only recognizes 
class file versions up to 52.0
```

**原因：**
系统默认使用 Java 8（version 52.0），但 `java-bridge@2.8.1` 是用 Java 9（version 53.0）编译的。

**❌ 错误做法：**
尝试降级 `java-bridge` 版本或修改 classpath。

**✅ 正确做法：**
1. 安装 Java 17
2. 在配置文件中指定 JVM 路径：
   ```json
   {
     "jvmPath": "D:\\usr\\java\\jdk-17.0.19x64\\bin\\server\\jvm.dll"
   }
   ```

**教训：**
始终检查 `java-bridge` 的版本要求，不要假设系统默认的 Java 版本可用。

---

### 问题 2：appendClasspath 调用成功但 classpath 为空

**现象：**
```
✓ appendClasspath 调用成功
Classpath 长度: 0 字符
```

**后续影响：**
所有 Maximo 类都报 `ClassNotFoundException`。

**❌ 错误做法：**
继续依赖 `appendClasspath`，反复尝试不同的参数格式。

**✅ 正确做法：**
直接使用 URLClassLoader：
```javascript
const URL = javaBridge.importClass('java.net.URL');
const URLClassLoader = javaBridge.importClass('java.net.URLClassLoader');
const ClassLoader = javaBridge.importClass('java.lang.ClassLoader');
const Thread = javaBridge.importClass('java.lang.Thread');

const systemClassLoader = ClassLoader.getSystemClassLoaderSync();
const urls = allJars.map(jar => new URL(`file:${jar.replace(/\\/g, '/')}`));
const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
Thread.currentThreadSync().setContextClassLoaderSync(urlClassLoader);
```

**教训：**
- `appendClasspath` 在某些版本的 `java-bridge` 中不可靠
- 不要仅凭“调用成功”判断功能正常，要验证实际效果
- URLClassLoader 是更可靠的方案

---

### 问题 3：Windows 路径未转换导致 URL 解析失败

**现象：**
```
java.net.MalformedURLException: no protocol: E:\gitwork\maximo9.1\maximolib\businessobjects.jar
```

**原因：**
Windows 路径中的反斜杠 `\` 未被转义，URL 解析器将其视为非法字符。

**❌ 错误做法：**
```javascript
// 错误：直接使用原始路径
const url = new URL(`file:${jar}`);
```

**✅ 正确做法：**
```javascript
// 正确：将反斜杠转换为正斜杠
const url = new URL(`file:${jar.replace(/\\/g, '/')}`);
```

**教训：**
在创建 `file:` URL 时，必须将 Windows 路径的反斜杠转换为正斜杠。

---

### 问题 4：忘记设置上下文 ClassLoader

**现象：**
URLClassLoader 创建成功，但加载类时仍然报 `ClassNotFoundException`。

**原因：**
创建了 URLClassLoader 但没有设置为线程上下文 ClassLoader，导致 `contextClassLoader.loadClassSync()` 使用的是默认的 ClassLoader。

**❌ 错误做法：**
```javascript
// 错误：只创建了 URLClassLoader，没有设置
const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
// 忘记这一行！
// Thread.currentThreadSync().setContextClassLoaderSync(urlClassLoader);
```

**✅ 正确做法：**
```javascript
const urlClassLoader = new URLClassLoader(urls, systemClassLoader);
// 关键步骤：设置上下文 ClassLoader
Thread.currentThreadSync().setContextClassLoaderSync(urlClassLoader);
```

**教训：**
创建 URLClassLoader 后，**必须**设置为线程上下文 ClassLoader，否则后续的类加载不会使用它。

---

### 问题 5：ES Module 导入未获取 default 导出

**现象：**
```
TypeError: javaBridge.ensureJvm is not a function
```

**原因：**
动态导入 ES Module 后，直接使用了模块对象，而不是 `default` 导出。

**❌ 错误做法：**
```javascript
// 错误
const javaBridge = await import('java-bridge');
await javaBridge.ensureJvm(...);  // TypeError!
```

**✅ 正确做法：**
```javascript
// 正确
const javaBridgeModule = await import('java-bridge');
const javaBridge = javaBridgeModule.default || javaBridgeModule;
await javaBridge.ensureJvm(...);  // ✓
```

**教训：**
`java-bridge` 是 ES Module，动态导入后必须获取 `default` 导出。

---

### 问题 6：类依赖缺失导致反射失败

**现象：**
```java
处理类: psdi.security.UserInfo
✗ 失败: java.lang.ClassNotFoundException: com.ibm.json.java.JSONObject
```

**原因：**
`UserInfo` 类的某些方法返回 `JSONObject` 类型，但 `json4j.jar` 不在 classpath 中。

**❌ 错误做法：**
1. 认为 URLClassLoader 设置有问题，反复调试
2. 或者放弃提取这个类

**✅ 正确做法：**
1. 识别缺失的依赖：`com.ibm.json.java.JSONObject` → 需要 `json4j.jar`
2. 找到 JAR 文件并添加到配置：
   ```json
   {
     "additionalJars": [
       "E:\\maximo\\lib\\json4j.jar"
     ]
   }
   ```
3. 或者暂时注释掉这个类，先提取其他无依赖的类

**教训：**
- 反射一个类时，它的所有依赖类也必须在 classpath 中
- 通过错误信息中的 `ClassNotFoundException` 可以快速定位缺失的依赖
- 采用渐进式策略：先提取核心类，再逐步添加有依赖的类

---

### 问题 7：配置文件不存在导致脚本报错

**现象：**
脚本尝试从 `classes-to-extract.json` 读取类列表，但文件不存在或格式错误。

**❌ 错误做法：**
维护额外的配置文件，增加复杂度。

**✅ 正确做法：**
直接在代码中硬编码类列表：
```javascript
const classesToExtract = [
  "psdi.mbo.MboRemote",
  "psdi.mbo.MboSetRemote",
  // ...
];
```

**教训：**
对于简单的测试脚本，硬编码比配置文件更简单可靠。只有在需要频繁修改时才使用配置文件。

---

### 总结：开发流程最佳实践

基于以上经验，推荐的开发流程：

1. **环境准备**
   - ✅ 确认 Java 9+ 已安装
   - ✅ 配置 `java-config.json` 指定 JVM 路径
   - ✅ 验证 JAR 文件存在且包含目标类

2. **初始化 JVM**
   - ✅ 动态导入 `java-bridge` 并获取 `default` 导出
   - ✅ 调用 `ensureJvm()` 启动 JVM
   - ✅ 验证 Java 版本符合要求

3. **加载 JAR**
   - ✅ 扫描目录收集 JAR 文件列表
   - ✅ 使用 URLClassLoader 加载 JAR
   - ✅ **关键：** 设置线程上下文 ClassLoader
   - ✅ 验证 classpath（即使为空也不影响）

4. **提取反射信息**
   - ✅ 使用 `contextClassLoader.loadClassSync()` 加载类
   - ✅ 回退到 `Class.forNameSync()` 作为备用
   - ✅ 捕获并记录详细的错误信息
   - ✅ 保存结果到 JSON 文件

5. **调试与优化**
   - ✅ 遇到错误时查看完整堆栈
   - ✅ 验证 JAR 文件内容
   - ✅ 检查 ClassLoader 状态
   - ✅ 逐步添加类，避免一次性处理太多

---

---

## 附录

### A. java-bridge API 参考

| 方法 | 说明 | 示例 |
|------|------|------|
| `ensureJvm(options)` | 启动 JVM | `await javaBridge.ensureJvm({...})` |
| `importClass(className)` | 导入 Java 类 | `javaBridge.importClass('java.lang.String')` |
| `appendClasspath(jars)` | 添加 JAR 到 classpath | `javaBridge.appendClasspath(['file.jar'])` |
| `newInstance(className, args)` | 创建 Java 对象实例 | `javaBridge.newInstance('java.lang.String', ['hello'])` |

### B. 常用 Java 类映射

| Java 类 | 用途 | 示例方法 |
|---------|------|----------|
| `java.lang.System` | 系统属性 | `getPropertySync('java.version')` |
| `java.lang.Class` | 类反射 | `forNameSync('className')` |
| `java.lang.Thread` | 线程操作 | `currentThreadSync()` |
| `java.net.URL` | URL 处理 | `new URL('file:path')` |
| `java.net.URLClassLoader` | 类加载器 | `new URLClassLoader(urls, parent)` |
| `java.lang.ClassLoader` | 类加载器基类 | `getSystemClassLoaderSync()` |
| `java.lang.reflect.Modifier` | 修饰符检查 | `isStaticSync(modifiers)` |

### C. 相关文档

- [java-bridge GitHub](https://github.com/MarkusJx/node-java-bridge)
- [java-bridge NPM](https://www.npmjs.com/package/java-bridge)
- [Electron asarUnpack 文档](https://www.electron.build/configuration/configuration.html#Configuration-asarUnpack)
- [Oracle Java 下载](https://www.oracle.com/java/technologies/downloads/)
- [Adoptium OpenJDK](https://adoptium.net/)

### D. 项目中的相关文件

- **主进程逻辑：** `main.js`（第 1270-1873 行）
- **测试脚本：** `test/test-extract-reflection.js`
- **配置文件：** `reflection-config/java-config.json`
- **AI 文档：** `aiDoc/JAVA_BRIDGE_SETUP.md`、`aiDoc/JAVA_CONFIG_GUIDE.md`

---

**最后更新：** 2026-05-01  
**适用版本：** java-bridge@2.8.1, Electron@28.0.0, Java 17
