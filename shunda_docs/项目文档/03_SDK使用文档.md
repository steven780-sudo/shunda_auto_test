# SDK 使用文档

> **文档版本**: v1.0
> **更新日期**: 2025-11-16
> **适用人员**: 开发人员

---

## 目录

1. [SDK 概述](#sdk-概述)
2. [Agent API](#agent-api)
3. [设备接口](#设备接口)
4. [AI 模型集成](#ai-模型集成)
5. [缓存机制](#缓存机制)
6. [报告生成](#报告生成)
7. [扩展开发](#扩展开发)

---

## SDK 概述

Midscene.js 提供了完整的 SDK 用于构建 AI 驱动的自动化测试。

### 核心包

| 包名 | 作用 | 导入方式 |
|------|------|---------|
| `@midscene/core` | 核心 SDK | `import { Agent } from '@midscene/core'` |
| `@midscene/web` | Web 自动化 | `import { PlaywrightAgent } from '@midscene/web/playwright'` |
| `@midscene/android` | Android 自动化 | `import { AndroidAgent } from '@midscene/android'` |
| `@midscene/ios` | iOS 自动化 | `import { IOSAgent } from '@midscene/ios'` |
| `@midscene/shared` | 共享工具 | `import { ModelConfigManager } from '@midscene/shared/env'` |

### 安装

```bash
# Web 自动化
npm install @midscene/web playwright

# Android 自动化
npm install @midscene/android

# iOS 自动化
npm install @midscene/ios

# 核心包 (通常不需要直接安装)
npm install @midscene/core
```

---

## Agent API

`Agent` 是 Midscene 的核心类,提供三类 API:

### 1. 交互操作 API

#### aiAction() - 自动规划执行

```typescript
await agent.aiAction(taskPrompt: string, options?: {
  cacheable?: boolean;  // 是否缓存 (默认 true)
  timeout?: number;     // 超时时间 (毫秒)
}): Promise<any>
```

**功能:** AI 自动规划并执行复杂任务

**示例:**
```typescript
// 简单操作
await agent.aiAction('点击登录按钮');

// 复杂操作
await agent.aiAction('完成用户注册流程,包括填写表单和验证邮箱');

// 禁用缓存
await agent.aiAction('执行随机操作', { cacheable: false });
```

#### aiTap() - 点击元素

```typescript
await agent.aiTap(locatePrompt: string, options?: {
  timeout?: number;
}): Promise<any>
```

**功能:** 定位并点击元素

**示例:**
```typescript
await agent.aiTap('提交按钮');
await agent.aiTap('页面右上角的关闭按钮');
```

#### aiInput() - 输入文本

```typescript
await agent.aiInput(locatePrompt: string, options: {
  value: string;  // 输入内容
  timeout?: number;
}): Promise<any>
```

**功能:** 定位元素并输入文本

**示例:**
```typescript
await agent.aiInput('用户名输入框', { value: 'test@example.com' });
await agent.aiInput('搜索框', { value: 'Midscene.js' });
```

#### aiScroll() - 滚动页面

```typescript
await agent.aiScroll(options: {
  direction: 'down' | 'up';  // 滚动方向
  distance?: number;         // 滚动距离 (像素)
}): Promise<any>
```

**功能:** 滚动页面

**示例:**
```typescript
// 向下滚动 500 像素
await agent.aiScroll({ direction: 'down', distance: 500 });

// 向上滚动
await agent.aiScroll({ direction: 'up', distance: 300 });
```

---

### 2. 数据提取 API

#### aiQuery() - 提取数据

```typescript
await agent.aiQuery<T = any>(demand: string, options?: {
  timeout?: number;
}): Promise<T>
```

**功能:** 从页面提取数据

**类型支持:**
- `string` - 字符串
- `number` - 数字
- `boolean` - 布尔值
- `Array<T>` - 数组
- `object` - 对象

**示例:**
```typescript
// 提取字符串
const title = await agent.aiQuery<string>('string, 获取页面标题');

// 提取数字
const price = await agent.aiQuery<number>('number, 获取商品价格');

// 提取布尔值
const isLoggedIn = await agent.aiQuery<boolean>('boolean, 用户是否已登录');

// 提取数组
const results = await agent.aiQuery<string[]>(
  'array<string>, 提取前5条搜索结果的标题'
);

// 提取对象
interface UserInfo {
  name: string;
  email: string;
  age: number;
}

const user = await agent.aiQuery<UserInfo>(
  'object, 提取用户信息(包含 name, email, age)'
);
```

#### aiBoolean() - 布尔判断

```typescript
await agent.aiBoolean(assertion: string, options?: {
  timeout?: number;
}): Promise<boolean>
```

**功能:** 判断条件是否满足,返回 true/false

**示例:**
```typescript
const isLoggedIn = await agent.aiBoolean('用户是否已登录');
const hasResults = await agent.aiBoolean('搜索结果不为空');
```

#### aiExtract() - 批量提取

```typescript
await agent.aiExtract<T = any>(schema: Schema, options?: {
  timeout?: number;
}): Promise<T>
```

**功能:** 根据 Schema 批量提取数据

**示例:**
```typescript
import { z } from 'zod';

// 定义 Schema
const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  inStock: z.boolean()
});

// 提取数据
const product = await agent.aiExtract(productSchema);
// 返回: { name: '...', price: 99.99, inStock: true }
```

---

### 3. 工具 API

#### aiAssert() - 断言验证

```typescript
await agent.aiAssert(assertion: string, options?: {
  timeout?: number;
}): Promise<void>
```

**功能:** 验证条件,失败时抛出异常

**示例:**
```typescript
// 断言成功 - 无异常
await agent.aiAssert('页面显示欢迎信息,包含用户名');

// 断言失败 - 抛出 AssertionError
await agent.aiAssert('页面显示错误信息');  // 抛出异常
```

#### aiLocate() - 定位元素

```typescript
await agent.aiLocate(prompt: string, options?: {
  timeout?: number;
}): Promise<{
  rect: [number, number, number, number];  // [x, y, width, height]
  center: [number, number];                // [x, y]
}>
```

**功能:** 定位元素并返回坐标信息

**示例:**
```typescript
const location = await agent.aiLocate('登录按钮');
console.log('元素位置:', location.rect);
console.log('元素中心:', location.center);

// 返回:
// { rect: [100, 200, 80, 40], center: [140, 220] }
```

#### aiWaitFor() - 等待条件

```typescript
await agent.aiWaitFor(condition: string, options?: {
  timeoutMs?: number;  // 超时时间 (毫秒, 默认 30000)
}): Promise<void>
```

**功能:** 等待条件满足,超时则抛出异常

**示例:**
```typescript
// 等待页面跳转
await agent.aiWaitFor('页面完成跳转');

// 等待元素出现
await agent.aiWaitFor('登录表单弹出', { timeoutMs: 10000 });

// 等待数据加载
await agent.aiWaitFor('搜索结果加载完成,至少显示3条');
```

#### runYaml() - 执行 YAML 脚本

```typescript
await agent.runYaml(yamlContent: string): Promise<Record<string, any>>
```

**功能:** 执行 YAML 格式的测试脚本

**示例:**
```typescript
const yamlContent = `
web:
  url: https://example.com

tasks:
  - name: "测试任务"
    flow:
      - aiQuery:
          demand: "string, 获取页面标题"
          name: title
`;

const result = await agent.runYaml(yamlContent);
console.log('结果:', result);
// 返回: { title: 'Example Domain' }
```

---

## 设备接口

### AbstractInterface

所有平台的设备都实现 `AbstractInterface` 接口:

```typescript
abstract class AbstractInterface {
  // 接口类型
  abstract interfaceType: string;

  // 获取页面截图 (Base64)
  abstract screenshotBase64(): Promise<string>;

  // 获取屏幕尺寸
  abstract size(): Promise<{ width: number; height: number }>;

  // 获取可用动作列表
  abstract actionSpace(): Promise<DeviceAction[]>;

  // 生命周期钩子 (可选)
  beforeInvokeAction?(actionName: string, param: any): Promise<void>;
  afterInvokeAction?(actionName: string, param: any): Promise<void>;

  // 获取页面上下文 (可选)
  getContext?(): Promise<UIContext>;

  // 执行 JavaScript (可选)
  evaluateJavaScript?(code: string): Promise<any>;

  // 获取元素树 (可选)
  getElementsNodeTree?(): Promise<ElementNode[]>;
}
```

### DeviceAction

```typescript
interface DeviceAction {
  type: string;  // 动作类型
  execute: (param: any) => Promise<void>;  // 执行函数
}
```

### 内置动作类型

| 动作类型 | 说明 | 参数 |
|---------|------|------|
| `Tap` | 点击 | `{ element: { center: [x, y] } }` |
| `Input` | 输入 | `{ element: { center: [x, y] }, value: string }` |
| `Scroll` | 滚动 | `{ direction: string, distance: number }` |
| `KeyboardPress` | 键盘按键 | `{ key: string }` |
| `Hover` | 悬停 | `{ element: { center: [x, y] } }` |
| `RightClick` | 右键点击 | `{ element: { center: [x, y] } }` |
| `DoubleClick` | 双击 | `{ element: { center: [x, y] } }` |
| `DragAndDrop` | 拖拽 | `{ from: [x, y], to: [x, y] }` |
| `LongPress` | 长按 | `{ element: { center: [x, y] }, duration: number }` |
| `Swipe` | 滑动 | `{ from: [x, y], to: [x, y] }` |

---

### 实现自定义设备

```typescript
import { AbstractInterface, DeviceAction } from '@midscene/core';

class MyCustomDevice implements AbstractInterface {
  interfaceType = 'my-custom';

  async screenshotBase64(): Promise<string> {
    // 实现截图逻辑
    const screenshot = await captureScreen();
    return `data:image/png;base64,${screenshot}`;
  }

  async size(): Promise<{ width: number; height: number }> {
    // 返回屏幕尺寸
    return { width: 1920, height: 1080 };
  }

  async actionSpace(): Promise<DeviceAction[]> {
    return [
      {
        type: 'Tap',
        execute: async (param) => {
          const [x, y] = param.element.center;
          // 实现点击逻辑
          await this.tap(x, y);
        }
      },
      {
        type: 'Input',
        execute: async (param) => {
          // 实现输入逻辑
          await this.input(param.value);
        }
      }
    ];
  }

  // 生命周期钩子
  async beforeInvokeAction(actionName: string, param: any) {
    console.log('即将执行:', actionName);
  }

  async afterInvokeAction(actionName: string, param: any) {
    console.log('执行完成:', actionName);
  }
}

// 使用
import { Agent } from '@midscene/core';

const device = new MyCustomDevice();
const agent = new Agent(device, {
  generateReport: true
});
```

---

## AI 模型集成

### ModelConfigManager

```typescript
import { ModelConfigManager } from '@midscene/shared/env';

const manager = ModelConfigManager.getInstance();

// 获取模型配置
const config = manager.getModelConfig('VQA');  // 视觉问答模型
const plannerConfig = manager.getModelConfig('Planning');  // 规划模型

// 配置结构
interface ModelConfig {
  provider: string;  // 'openai', 'anthropic', 'google', etc.
  apiKey: string;
  baseURL?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}
```

### 调用 AI 模型

```typescript
import { callAI } from '@midscene/core/ai-model';

const response = await callAI([
  {
    role: 'system',
    content: '你是一个 UI 元素定位专家'
  },
  {
    role: 'user',
    content: [
      {
        type: 'image_url',
        image_url: { url: screenshotBase64 }
      },
      {
        type: 'text',
        text: '定位页面上的登录按钮'
      }
    ]
  }
], modelConfig);

console.log('AI 响应:', response.content);
```

### 自定义模型配置

```typescript
const agent = await PlaywrightAgent.create(page, {
  modelConfig: () => {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY!,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096
    };
  }
});
```

---

## 缓存机制

### TaskCache

```typescript
import { TaskCache } from '@midscene/core';

const cache = new TaskCache(
  'my-cache-id',  // 缓存 ID
  true,           // 是否启用
  './cache',      // 缓存目录 (可选)
  {
    readOnly: false,   // 是否只读
    writeOnly: false   // 是否只写
  }
);
```

### 使用缓存

```typescript
// 在创建 Agent 时配置
const agent = await PlaywrightAgent.create(page, {
  cache: {
    enabled: true,
    id: 'my-test-cache',
    strategy: 'read-write',
    cacheDir: './cache'
  }
});

// 第一次执行 - 调用 AI
await agent.aiAction('点击登录按钮');

// 第二次执行 - 使用缓存 (不调用 AI)
await agent.aiAction('点击登录按钮');
```

### 缓存策略

```typescript
// 只读缓存 (不写入新缓存)
cache: {
  enabled: true,
  strategy: 'read-only'
}

// 只写缓存 (不使用已有缓存)
cache: {
  enabled: true,
  strategy: 'write-only'
}

// 读写缓存 (默认)
cache: {
  enabled: true,
  strategy: 'read-write'
}
```

---

## 报告生成

### 自动生成报告

```typescript
const agent = await PlaywrightAgent.create(page, {
  generateReport: true,           // 启用报告生成
  autoPrintReportMsg: true,       // 自动打印报告路径
  groupName: '登录功能测试',     // 报告组名
  groupDescription: '测试用户登录流程',  // 报告描述
  outputDir: './reports'          // 输出目录
});

// 执行任务
await agent.aiAction('执行测试');

// 控制台输出:
// Report: file:///path/to/reports/report_2025-11-16_15-30-45.html
```

### 手动生成报告

```typescript
// 获取报告 HTML
const htmlContent = agent.reportHTMLString();

// 保存到文件
import fs from 'fs';
fs.writeFileSync('report.html', htmlContent);

// 获取数据 JSON
const dumpData = agent.dumpDataString();
fs.writeFileSync('report.json', dumpData);
```

### 自定义报告

```typescript
import { writeLogFile } from '@midscene/core/utils';

// 写入报告文件
const reportPath = writeLogFile({
  fileName: 'my-test',
  fileExt: 'json',
  fileContent: JSON.stringify(data),
  type: 'dump',
  generateReport: true
});

console.log('报告路径:', reportPath);
```

---

## 扩展开发

### 1. 自定义 Prompt

编辑 `packages/core/src/ai-model/prompt/` 下的文件:

```typescript
// 自定义元素定位 Prompt
export function myCustomLocatorPrompt(description: string): string {
  return `
你是一个专业的 UI 元素定位专家。

请定位: ${description}

要求:
1. 返回元素的中心坐标 (x, y)
2. 坐标范围: x: 0-{width}, y: 0-{height}
3. 精确到像素

返回格式: (x, y)
`;
}
```

### 2. 扩展动作空间

```typescript
// 创建自定义 WebPage
class CustomWebPage extends WebPage {
  async actionSpace(): Promise<DeviceAction[]> {
    const baseActions = await super.actionSpace();

    return [
      ...baseActions,
      {
        type: 'TripleClick',
        execute: async (param) => {
          const [x, y] = param.element.center;
          await this.page.mouse.click(x, y, { clickCount: 3 });
        }
      }
    ];
  }
}
```

### 3. 自定义 Insight

```typescript
import { Insight } from '@midscene/core';

class CustomInsight extends Insight {
  // 添加自定义方法
  async extractTable(tableLocator: string): Promise<any[][]> {
    const context = await this.getContext();

    // 使用 AI 提取表格数据
    const prompt = `从页面中提取表格 "${tableLocator}" 的所有数据`;

    const result = await this.query(prompt);
    return result;
  }
}
```

### 4. 监听事件

```typescript
const agent = await PlaywrightAgent.create(page, {
  onTaskStartTip: async (tip) => {
    console.log('任务开始:', tip);
  },
  onDumpUpdate: (dumpData) => {
    console.log('执行记录更新:', dumpData);
    // 可以实时保存或发送到监控系统
  }
});
```

### 5. AI 上下文

```typescript
// 设置全局 AI 上下文
await agent.setAIActionContext(`
当前用户角色: 管理员
当前页面: 用户管理页面
注意事项: 操作前需要确认权限
`);

// 后续的 AI 操作都会考虑这个上下文
await agent.aiAction('删除用户');
```

---

## API 参考表

### Agent API

| 方法 | 类型 | 说明 |
|------|------|------|
| `aiAction(prompt)` | 交互 | 自动规划并执行任务 |
| `aiTap(locate)` | 交互 | 点击元素 |
| `aiInput(locate, {value})` | 交互 | 输入文本 |
| `aiScroll({direction, distance})` | 交互 | 滚动页面 |
| `aiQuery<T>(demand)` | 提取 | 提取数据 |
| `aiBoolean(assertion)` | 提取 | 布尔判断 |
| `aiExtract<T>(schema)` | 提取 | 批量提取 |
| `aiAssert(assertion)` | 工具 | 断言验证 |
| `aiLocate(prompt)` | 工具 | 定位元素 |
| `aiWaitFor(condition, {timeoutMs})` | 工具 | 等待条件 |
| `runYaml(yaml)` | 工具 | 执行 YAML 脚本 |
| `freezePageContext()` | 工具 | 冻结页面上下文 |
| `unfreezePageContext()` | 工具 | 解冻页面上下文 |
| `reportHTMLString()` | 工具 | 获取报告 HTML |
| `dumpDataString()` | 工具 | 获取数据 JSON |

### Agent 配置选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `generateReport` | `boolean` | 是否生成报告 |
| `autoPrintReportMsg` | `boolean` | 自动打印报告路径 |
| `groupName` | `string` | 报告组名 |
| `groupDescription` | `string` | 报告描述 |
| `outputDir` | `string` | 输出目录 |
| `cache` | `CacheConfig` | 缓存配置 |
| `modelConfig` | `() => ModelConfig` | 模型配置 |
| `onTaskStartTip` | `(tip: string) => void` | 任务开始回调 |
| `onDumpUpdate` | `(dump: string) => void` | 执行记录更新回调 |

---

**文档结束**

© 2025 孙顺达 版权所有
