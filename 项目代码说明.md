# AUTO_TEST 项目代码详细说明文档

> **文档版本**: v1.0  
> **项目版本**: 0.30.8  
> **更新日期**: 202511-11  
> **适用场景**: 功能迭代、UI 界面定制

---

## 目录

1. [项目概述](#1-项目概述)
2. [项目文件夹结构](#2-项目文件夹结构)
3. [项目架构设计](#3-项目架构设计)
4. [核心代码文件详解](#4-核心代码文件详解)
5. [使用操作手册](#5-使用操作手册)
6. [二次开发指南](#6-二次开发指南)

---

## 1. 项目概述

### 1.1 项目简介

**Midscene.js** 是一个基于视觉语言模型（VLM）的 AI 驱动的 UI 自动化框架，支持 Web、Android 和 iOS 平台。它允许开发者使用自然语言描述来控制用户界面、提取数据和执行断言。

### 1.2 核心特性

- **自然语言驱动**: 使用自然语言描述任务，AI 自动规划和执行
- **多平台支持**: Web（Puppeteer/Playwright）、Android（ADB）、iOS（WebDriverAgent）
- **视觉语言模型**: 支持 Qwen2.5-VL、UI-TARS、GPT-4o、Gemini 等多种模型
- **可视化调试**: 提供详细的测试报告和 Playground 工具
- **缓存机制**: 支持执行结果缓存，提高效率
- **MCP 支持**: 可作为 Model Context Protocol 服务器使用

### 1.3 技术栈

- **语言**: TypeScript
- **构建工具**: Rslib (基于 Rsbuild)
- **包管理**: pnpm (Monorepo)
- **测试框架**: Vitest, Playwright
- **UI 框架**: React
- **AI SDK**: OpenAI SDK, Anthropic SDK, Langchain

---

## 2. 项目文件夹结构

### 2.1 整体结构

```
midscene/
├── apps/                    # 应用程序目录
├── packages/                # 核心包目录
├── scripts/                 # 构建和发布脚本
├── .github/                 # GitHub 配置
├── package.json             # 根配置文件
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── nx.json                  # Nx 构建配置
└── README.md                # 项目说明
```


### 2.2 apps/ 目录详解

apps 目录包含所有可独立运行的应用程序：

#### 2.2.1 android-playground
- **功能**: Android 设备控制的 Web 界面
- **技术**: React + Rsbuild
- **核心文件**:
  - `src/App.tsx`: 主应用组件
  - `src/components/adb-device/`: ADB 设备连接组件
  - `src/components/scrcpy-player/`: Android 屏幕镜像播放器
  - `src/components/playground-panel/`: 操作面板

#### 2.2.2 chrome-extension
- **功能**: Chrome 浏览器扩展，提供桥接模式和录制功能
- **技术**: React + Chrome Extension API
- **核心文件**:
  - `src/extension/popup/`: 扩展弹窗界面
  - `src/extension/recorder/`: 用户操作录制器
  - `src/extension/bridge/`: 桥接模式通信
  - `src/scripts/event-recorder-bridge.ts`: 事件录制桥接
  - `static/manifest.json`: 扩展配置文件

#### 2.2.3 playground
- **功能**: Web 自动化的可视化 Playground
- **技术**: React + Socket.io
- **核心文件**:
  - `src/App.tsx`: 主界面
  - `src/components/screenshot-viewer/`: 截图查看器
  - `demo/server.ts`: 演示服务器

#### 2.2.4 recorder-form
- **功能**: 表单录制工具
- **技术**: React
- **核心文件**:
  - `src/components/canvas-selector/`: Canvas 元素选择器

#### 2.2.5 report
- **功能**: 测试报告可视化应用
- **技术**: React + PixiJS
- **核心文件**:
  - `src/components/report-overview/`: 报告概览
  - `src/components/timeline/`: 时间线组件
  - `src/components/playground/`: 内嵌 Playground
  - `src/components/yaml-player-component/`: YAML 脚本播放器

#### 2.2.6 site
- **功能**: 官方文档网站
- **技术**: Rspress (基于 Rspack 的文档生成器)
- **核心文件**:
  - `docs/zh/`: 中文文档
  - `docs/en/`: 英文文档
  - `rspress.config.ts`: 文档配置

### 2.3 packages/ 目录详解

packages 目录包含所有可复用的核心库：

#### 2.3.1 core (核心包)
- **功能**: 框架核心逻辑，包括 AI 模型调用、任务执行、报告生成
- **主要导出**:
  - `Agent`: 智能代理类
  - `Insight`: 数据提取和查询
  - `Executor`: 任务执行器
- **关键目录**:
  - `src/agent/`: Agent 实现
  - `src/ai-model/`: AI 模型集成
  - `src/device/`: 设备抽象接口
  - `src/insight/`: 数据提取逻辑
  - `src/yaml/`: YAML 脚本解析和执行

#### 2.3.2 web-integration
- **功能**: Web 平台集成，支持 Puppeteer 和 Playwright
- **主要导出**:
  - `PuppeteerAgent`: Puppeteer 集成
  - `PlaywrightAgent`: Playwright 集成
  - `StaticPageAgent`: 静态页面分析
- **关键目录**:
  - `src/puppeteer/`: Puppeteer 适配器
  - `src/playwright/`: Playwright 适配器
  - `src/bridge-mode/`: 桥接模式实现
  - `src/chrome-extension/`: Chrome 扩展集成

#### 2.3.3 android
- **功能**: Android 平台自动化
- **依赖**: appium-adb
- **核心文件**:
  - `src/agent.ts`: Android Agent
  - `src/device.ts`: Android 设备接口
  - `src/utils.ts`: ADB 工具函数

#### 2.3.4 ios
- **功能**: iOS 平台自动化
- **依赖**: WebDriverAgent
- **核心文件**:
  - `src/agent.ts`: iOS Agent
  - `src/device.ts`: iOS 设备接口
  - `src/ios-webdriver-client.ts`: WebDriver 客户端

#### 2.3.5 cli
- **功能**: 命令行工具，支持 YAML 脚本批量执行
- **命令**: `midscene`
- **核心文件**:
  - `src/args.ts`: 命令行参数解析
  - `src/batch-runner.ts`: 批量执行器
  - `src/create-yaml-player.ts`: YAML 播放器创建

#### 2.3.6 playground
- **功能**: Playground 服务器和 SDK
- **核心文件**:
  - `src/server.ts`: WebSocket 服务器
  - `src/launcher.ts`: Playground 启动器
  - `src/sdk/`: Playground SDK
  - `src/adapters/`: 执行适配器

#### 2.3.7 visualizer
- **功能**: 可视化组件库
- **核心组件**:
  - `UniversalPlayground`: 通用 Playground 组件
  - `ContextPreview`: 上下文预览
  - `Player`: 回放播放器
  - `Blackboard`: 画板组件

#### 2.3.8 shared
- **功能**: 共享工具和类型定义
- **核心模块**:
  - `src/env/`: 环境变量管理
  - `src/img/`: 图像处理
  - `src/logger.ts`: 日志工具
  - `src/utils.ts`: 通用工具函数

#### 2.3.9 recorder
- **功能**: 用户操作录制器
- **核心文件**:
  - `src/recorder.ts`: 录制器核心
  - `src/RecordTimeline.tsx`: 录制时间线组件

#### 2.3.10 mcp
- **功能**: Model Context Protocol 服务器实现
- **核心文件**:
  - `src/index.ts`: MCP 服务器入口
  - `src/tools.ts`: MCP 工具定义
  - `src/prompts.ts`: MCP 提示词
  - `src/resources.ts`: MCP 资源

#### 2.3.11 webdriver
- **功能**: WebDriver 客户端封装
- **核心目录**:
  - `src/clients/`: WebDriver 客户端
  - `src/managers/`: 设备管理器

#### 2.3.12 android-playground / ios-playground
- **功能**: Android/iOS Playground 命令行工具
- **命令**: `midscene-android-playground`, `midscene-ios-playground`

#### 2.3.13 evaluation
- **功能**: 模型评估和测试数据
- **核心目录**:
  - `page-cases/`: 测试用例
  - `page-data/`: 测试数据
  - `tests/`: 评估测试

---

## 3. 项目架构设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (Apps)                           │
│  Chrome Extension │ Playground │ Report │ Site              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    平台集成层 (Integration)                  │
│  @midscene/web │ @midscene/android │ @midscene/ios          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      核心层 (Core)                           │
│  Agent │ Insight │ Executor │ AI Model │ YAML Parser        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    基础设施层 (Infrastructure)               │
│  Device Interface │ Cache │ Logger │ Image Processing       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 核心模块关系

#### 3.2.1 Agent (智能代理)
- **职责**: 提供高级 API，协调各个模块完成自动化任务
- **依赖**: Interface (设备接口), Insight (数据提取), TaskExecutor (任务执行)
- **主要方法**:
  - `aiAction()`: 自动规划并执行任务
  - `aiQuery()`: 提取数据
  - `aiAssert()`: 执行断言
  - `aiTap()`, `aiInput()`, `aiScroll()`: 基础交互操作

#### 3.2.2 Insight (洞察)
- **职责**: 使用 AI 模型从页面中提取信息
- **核心功能**:
  - 元素定位 (Locate)
  - 数据提取 (Extract)
  - 页面描述 (Describe)

#### 3.2.3 Executor (执行器)
- **职责**: 执行具体的操作任务
- **类型**:
  - `TaskExecutor`: 任务执行器
  - `ScriptPlayer`: YAML 脚本播放器

#### 3.2.4 AI Model Integration
- **支持的模型**:
  - OpenAI (GPT-4o, GPT-4-vision)
  - Anthropic (Claude)
  - Google (Gemini)
  - Qwen (Qwen2.5-VL)
  - UI-TARS (开源模型)
- **模型配置**: 通过 `ModelConfigManager` 管理

### 3.3 数据流

```
用户请求 → Agent → TaskExecutor → AI Model → Device Interface → 实际设备
                ↓                      ↓
            Cache (可选)          Insight (数据提取)
                ↓                      ↓
            Report                  返回结果
```

### 3.4 设备抽象层

所有平台都实现统一的 `AbstractInterface` 接口：

```typescript
interface AbstractInterface {
  interfaceType: string;
  actionSpace(): Promise<DeviceAction[]>;
  getContext?(): Promise<UIContext>;
  size(): Promise<{ width: number; height: number }>;
  // ... 其他方法
}
```

平台实现：
- **Web**: `PuppeteerPage`, `PlaywrightPage`
- **Android**: `AndroidDevice`
- **iOS**: `IOSDevice`

---


## 4. 核心代码文件详解

### 4.1 Agent 核心实现

**文件**: `packages/core/src/agent/agent.ts`

#### 4.1.1 Agent 类结构

```typescript
export class Agent<InterfaceType extends AbstractInterface> {
  interface: InterfaceType;           // 设备接口
  insight: Insight;                   // 数据提取模块
  dump: GroupedActionDump;            // 执行记录
  taskExecutor: TaskExecutor;         // 任务执行器
  taskCache?: TaskCache;              // 缓存管理
  modelConfigManager: ModelConfigManager; // 模型配置
  
  // 核心方法
  async aiAction(taskPrompt: string): Promise<any>
  async aiQuery<T>(demand: string): Promise<T>
  async aiAssert(assertion: string): Promise<void>
  async aiTap(locatePrompt: string): Promise<any>
  async aiInput(locatePrompt: string, opt: {value: string}): Promise<any>
  async aiLocate(prompt: string): Promise<{rect, center}>
  async aiWaitFor(assertion: string, opt?: {timeoutMs}): Promise<void>
}
```

#### 4.1.2 关键方法实现

**aiAction() - 自动规划执行**
```typescript
async aiAction(taskPrompt: string, opt?: {cacheable?: boolean}) {
  // 1. 检查缓存
  const matchedCache = this.taskCache?.matchPlanCache(taskPrompt);
  if (matchedCache) {
    return this.runYaml(matchedCache.cacheContent?.yamlWorkflow);
  }
  
  // 2. 调用 AI 规划
  const { output, executor } = await this.taskExecutor.action(
    taskPrompt,
    modelConfig,
    this.opts.aiActionContext,
    cacheable
  );
  
  // 3. 更新缓存
  if (output?.yamlFlow) {
    this.taskCache.updateOrAppendCacheRecord({
      type: 'plan',
      prompt: taskPrompt,
      yamlWorkflow: yamlFlowStr
    });
  }
  
  // 4. 生成报告
  await this.afterTaskRunning(executor);
  return output;
}
```

**aiQuery() - 数据提取**
```typescript
async aiQuery<ReturnType>(demand: string): Promise<ReturnType> {
  const modelConfig = this.modelConfigManager.getModelConfig('VQA');
  const { output, executor } = await this.taskExecutor.createTypeQueryExecution(
    'Query',
    demand,
    modelConfig,
    opt
  );
  await this.afterTaskRunning(executor);
  return output as ReturnType;
}
```

**aiTap() - 点击操作**
```typescript
async aiTap(locatePrompt: string, opt?: LocateOption) {
  const detailedLocateParam = buildDetailedLocateParam(locatePrompt, opt);
  return this.callActionInActionSpace('Tap', {
    locate: detailedLocateParam
  });
}
```

### 4.2 AI 模型集成

**文件**: `packages/core/src/ai-model/`

#### 4.2.1 模型调用流程

```typescript
// service-caller/index.ts
export async function callAI(
  messages: ChatCompletionMessageParam[],
  config: ModelConfig
): Promise<AIResponse> {
  // 1. 根据配置选择模型提供商
  const provider = config.provider; // 'openai', 'anthropic', 'google', etc.
  
  // 2. 构建请求
  const request = buildRequest(messages, config);
  
  // 3. 调用 API
  const response = await callProvider(provider, request);
  
  // 4. 解析响应
  return parseResponse(response);
}
```

#### 4.2.2 元素定位 (Locate)

**文件**: `packages/core/src/ai-model/inspect.ts`

```typescript
export async function AiLocateElement(
  context: UIContext,
  locatePrompt: string,
  modelConfig: ModelConfig
): Promise<LocateResult> {
  // 1. 构建提示词
  const prompt = systemPromptToLocateElement(locatePrompt);
  
  // 2. 调用 AI 模型
  const response = await callAI([
    { role: 'system', content: prompt },
    { role: 'user', content: [
      { type: 'image_url', image_url: { url: context.screenshotBase64 } },
      { type: 'text', text: locatePrompt }
    ]}
  ], modelConfig);
  
  // 3. 解析坐标
  const location = parseMidsceneLocation(response);
  return {
    rect: location.rect,
    center: location.center
  };
}
```

#### 4.2.3 UI-TARS 规划

**文件**: `packages/core/src/ai-model/ui-tars-planning.ts`

```typescript
export async function uiTarsPlanning(
  taskPrompt: string,
  context: UIContext,
  modelConfig: ModelConfig
): Promise<PlanningAction[]> {
  // 1. 调用 UI-TARS 模型
  const response = await callUITarsModel(taskPrompt, context, modelConfig);
  
  // 2. 解析动作序列
  const actions = parseUITarsActions(response);
  
  // 3. 转换为标准格式
  return actions.map(action => ({
    type: action.type,
    param: action.param,
    thought: action.thought
  }));
}
```

### 4.3 任务执行器

**文件**: `packages/core/src/agent/tasks.ts`

#### 4.3.1 TaskExecutor 类

```typescript
export class TaskExecutor {
  constructor(
    private interface: AbstractInterface,
    private insight: Insight,
    private options: TaskExecutorOptions
  ) {}
  
  // 执行规划的动作序列
  async runPlans(
    title: string,
    plans: PlanningAction[],
    modelConfig: ModelConfig
  ): Promise<ExecutionResult> {
    const executor = new Executor(title);
    
    for (const plan of plans) {
      // 1. 定位元素
      if (plan.param?.locate) {
        const element = await this.locateElement(plan.param.locate);
        plan.param.element = element;
      }
      
      // 2. 执行动作
      await this.executeAction(plan, executor);
      
      // 3. 记录日志
      executor.appendTaskLog({
        type: plan.type,
        param: plan.param,
        status: 'success'
      });
    }
    
    return { executor, output: executor.output };
  }
  
  // 执行单个动作
  private async executeAction(
    plan: PlanningAction,
    executor: Executor
  ): Promise<void> {
    const actionSpace = await this.interface.actionSpace();
    const action = actionSpace.find(a => a.type === plan.type);
    
    if (!action) {
      throw new Error(`Unknown action type: ${plan.type}`);
    }
    
    await action.execute(plan.param);
  }
}
```

### 4.4 YAML 脚本解析

**文件**: `packages/core/src/yaml/`

#### 4.4.1 YAML 脚本格式

```yaml
tasks:
  - name: "登录测试"
    flow:
      - aiAction: "点击登录按钮"
      - aiInput:
          locate: "用户名输入框"
          value: "test@example.com"
      - aiInput:
          locate: "密码输入框"
          value: "password123"
      - aiTap: "提交按钮"
      - aiAssert: "页面显示欢迎信息"
```

#### 4.4.2 ScriptPlayer 实现

```typescript
export class ScriptPlayer {
  constructor(
    private agent: Agent,
    private script: MidsceneYamlScript
  ) {}
  
  async play(): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    
    for (const task of this.script.tasks) {
      console.log(`执行任务: ${task.name}`);
      
      for (const flowItem of task.flow) {
        // 解析流程项
        const { action, params } = this.parseFlowItem(flowItem);
        
        // 执行对应的 Agent 方法
        const result = await this.executeFlowItem(action, params);
        
        // 保存结果
        if (flowItem.saveAs) {
          results[flowItem.saveAs] = result;
        }
      }
    }
    
    return results;
  }
  
  private async executeFlowItem(action: string, params: any) {
    switch (action) {
      case 'aiAction':
        return await this.agent.aiAction(params);
      case 'aiTap':
        return await this.agent.aiTap(params.locate, params);
      case 'aiInput':
        return await this.agent.aiInput(params.locate, params);
      case 'aiQuery':
        return await this.agent.aiQuery(params);
      case 'aiAssert':
        return await this.agent.aiAssert(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}
```

### 4.5 平台集成实现

#### 4.5.1 Puppeteer 集成

**文件**: `packages/web-integration/src/puppeteer/index.ts`

```typescript
export class PuppeteerAgent extends Agent<PuppeteerPage> {
  static async create(
    page: PuppeteerPageType,
    opts?: AgentOpt
  ): Promise<PuppeteerAgent> {
    const puppeteerPage = new PuppeteerPage(page);
    return new PuppeteerAgent(puppeteerPage, opts);
  }
}

// PuppeteerPage 实现 AbstractInterface
class PuppeteerPage implements AbstractInterface {
  interfaceType = 'puppeteer';
  
  constructor(private page: PuppeteerPageType) {}
  
  async actionSpace(): Promise<DeviceAction[]> {
    return [
      {
        type: 'Tap',
        execute: async (param) => {
          await this.page.mouse.click(param.element.center[0], param.element.center[1]);
        }
      },
      {
        type: 'Input',
        execute: async (param) => {
          await this.page.type(param.element.selector, param.value);
        }
      },
      // ... 其他动作
    ];
  }
  
  async getContext(): Promise<UIContext> {
    const screenshot = await this.page.screenshot({ encoding: 'base64' });
    const size = await this.page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    
    return {
      screenshotBase64: `data:image/png;base64,${screenshot}`,
      size,
      url: this.page.url()
    };
  }
}
```

#### 4.5.2 Android 集成

**文件**: `packages/android/src/device.ts`

```typescript
export class AndroidDevice implements AbstractInterface {
  interfaceType = 'android';
  
  constructor(
    private adb: ADB,
    private deviceId: string
  ) {}
  
  async actionSpace(): Promise<DeviceAction[]> {
    return [
      {
        type: 'Tap',
        execute: async (param) => {
          const [x, y] = param.element.center;
          await this.adb.shell(this.deviceId, `input tap ${x} ${y}`);
        }
      },
      {
        type: 'Input',
        execute: async (param) => {
          // 先点击输入框
          await this.tap(param.element.center);
          // 输入文本
          await this.adb.shell(this.deviceId, `input text "${param.value}"`);
        }
      },
      {
        type: 'Scroll',
        execute: async (param) => {
          const { direction, distance } = param;
          await this.adb.shell(
            this.deviceId,
            `input swipe ${startX} ${startY} ${endX} ${endY} ${duration}`
          );
        }
      }
    ];
  }
  
  async getContext(): Promise<UIContext> {
    // 获取屏幕截图
    const screenshot = await this.adb.screencap(this.deviceId);
    
    // 获取屏幕尺寸
    const size = await this.getScreenSize();
    
    return {
      screenshotBase64: `data:image/png;base64,${screenshot}`,
      size
    };
  }
}
```

### 4.6 缓存机制

**文件**: `packages/core/src/agent/task-cache.ts`

```typescript
export class TaskCache {
  private cacheData: CacheRecord[] = [];
  
  constructor(
    private cacheId: string,
    private enabled: boolean,
    private cacheFilePath?: string,
    private options?: { readOnly?: boolean; writeOnly?: boolean }
  ) {
    this.loadCache();
  }
  
  // 匹配规划缓存
  matchPlanCache(prompt: string): CacheMatch | undefined {
    if (!this.isCacheResultUsed) return undefined;
    
    return this.cacheData.find(record => 
      record.type === 'plan' && 
      this.isSimilarPrompt(record.prompt, prompt)
    );
  }
  
  // 更新或追加缓存记录
  updateOrAppendCacheRecord(
    record: CacheRecord,
    matchedCache?: CacheMatch
  ): void {
    if (!this.enabled || this.options?.readOnly) return;
    
    if (matchedCache) {
      // 更新现有记录
      const index = this.cacheData.indexOf(matchedCache);
      this.cacheData[index] = record;
    } else {
      // 追加新记录
      this.cacheData.push(record);
    }
    
    this.saveCache();
  }
  
  private isSimilarPrompt(cached: string, input: string): boolean {
    // 简单的相似度判断，可以使用更复杂的算法
    return cached.toLowerCase() === input.toLowerCase();
  }
}
```

### 4.7 报告生成

**文件**: `packages/core/src/utils.ts`

```typescript
export function writeLogFile(options: {
  fileName: string;
  fileExt: string;
  fileContent: string;
  type: 'dump' | 'cache';
  generateReport?: boolean;
}): string | null {
  const { fileName, fileExt, fileContent, type, generateReport } = options;
  
  // 1. 确定输出目录
  const outputDir = process.env.MIDSCENE_OUTPUT_DIR || './midscene_run';
  
  // 2. 写入数据文件
  const dataFilePath = path.join(outputDir, `${fileName}.${fileExt}`);
  fs.writeFileSync(dataFilePath, fileContent);
  
  // 3. 生成 HTML 报告
  if (generateReport && type === 'dump') {
    const htmlContent = reportHTMLContent(fileContent);
    const htmlFilePath = path.join(outputDir, `${fileName}.html`);
    fs.writeFileSync(htmlFilePath, htmlContent);
    return htmlFilePath;
  }
  
  return dataFilePath;
}

export function reportHTMLContent(dumpData: string): string {
  // 嵌入报告应用和数据
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Midscene Report</title>
        <script>
          window.__MIDSCENE_REPORT_DATA__ = ${dumpData};
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script src="${REPORT_APP_URL}"></script>
      </body>
    </html>
  `;
}
```

### 4.8 Playground 服务器

**文件**: `packages/playground/src/server.ts`

```typescript
export class PlaygroundServer {
  private io: SocketIOServer;
  private agent?: Agent;
  
  constructor(private port: number) {
    this.io = new SocketIOServer(this.port, {
      cors: { origin: '*' }
    });
    
    this.setupHandlers();
  }
  
  private setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected');
      
      // 执行动作
      socket.on('execute', async (data) => {
        const { action, params } = data;
        
        try {
          const result = await this.executeAction(action, params);
          socket.emit('result', { success: true, data: result });
        } catch (error) {
          socket.emit('result', { success: false, error: error.message });
        }
      });
      
      // 获取上下文
      socket.on('getContext', async () => {
        const context = await this.agent?.getUIContext();
        socket.emit('context', context);
      });
    });
  }
  
  private async executeAction(action: string, params: any) {
    if (!this.agent) {
      throw new Error('Agent not initialized');
    }
    
    switch (action) {
      case 'aiAction':
        return await this.agent.aiAction(params.prompt);
      case 'aiTap':
        return await this.agent.aiTap(params.locate);
      case 'aiQuery':
        return await this.agent.aiQuery(params.demand);
      // ... 其他动作
    }
  }
  
  setAgent(agent: Agent) {
    this.agent = agent;
  }
  
  start() {
    console.log(`Playground server started on port ${this.port}`);
  }
}
```

---


## 5. 使用操作手册

### 5.1 环境配置

#### 5.1.1 系统要求

- **Node.js**: >= 18.19.0
- **pnpm**: >= 9.3.0
- **操作系统**: macOS, Linux, Windows

#### 5.1.2 安装依赖

```bash
# 克隆项目
git clone https://github.com/web-infra-dev/midscene.git
cd midscene

# 安装依赖
pnpm install

# 构建所有包
pnpm run build
```

#### 5.1.3 配置 AI 模型

创建 `.env` 文件：

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1  # 可选

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Qwen (通义千问)
QWEN_API_KEY=your_qwen_api_key
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# UI-TARS (本地部署)
UI_TARS_BASE_URL=http://localhost:8000

# 模型选择
MIDSCENE_MODEL_NAME=gpt-4o  # 或 qwen-vl-max, ui-tars, gemini-2.0-flash-exp
```

### 5.2 Web 自动化使用

#### 5.2.1 使用 Puppeteer

```typescript
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import puppeteer from 'puppeteer';

async function main() {
  // 1. 启动浏览器
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // 2. 创建 Agent
  const agent = await PuppeteerAgent.create(page, {
    generateReport: true,
    groupName: '我的测试'
  });
  
  // 3. 导航到页面
  await page.goto('https://example.com');
  
  // 4. 执行自动化任务
  await agent.aiAction('点击登录按钮');
  await agent.aiInput('用户名输入框', { value: 'test@example.com' });
  await agent.aiInput('密码输入框', { value: 'password123' });
  await agent.aiTap('提交按钮');
  
  // 5. 数据提取
  const username = await agent.aiQuery<string>('获取当前登录用户名');
  console.log('用户名:', username);
  
  // 6. 断言
  await agent.aiAssert('页面显示欢迎信息');
  
  // 7. 清理
  await browser.close();
}

main();
```

#### 5.2.2 使用 Playwright

```typescript
import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const agent = await PlaywrightAgent.create(page, {
    generateReport: true
  });
  
  await page.goto('https://example.com');
  
  // 使用自然语言描述任务
  await agent.aiAction('搜索 "Midscene.js" 并打开第一个结果');
  
  // 提取结构化数据
  const products = await agent.aiQuery<Array<{
    name: string;
    price: number;
  }>>('提取页面上所有产品的名称和价格');
  
  console.log('产品列表:', products);
  
  await browser.close();
}

main();
```

#### 5.2.3 使用 Chrome 扩展（桥接模式）

1. 安装 Chrome 扩展
2. 打开要自动化的网页
3. 点击扩展图标，启动 Playground
4. 在 Playground 中输入自然语言指令

```typescript
// 或者通过代码连接
import { BridgeModeAgent } from '@midscene/web/bridge-mode';

const agent = await BridgeModeAgent.create({
  port: 3000  // 扩展监听的端口
});

await agent.aiAction('点击购买按钮');
```

### 5.3 Android 自动化使用

#### 5.3.1 环境准备

```bash
# 安装 ADB
# macOS
brew install android-platform-tools

# Linux
sudo apt-get install android-tools-adb

# 连接设备
adb devices
```

#### 5.3.2 代码示例

```typescript
import { AndroidAgent } from '@midscene/android';

async function main() {
  // 1. 创建 Agent（自动连接第一个设备）
  const agent = await AndroidAgent.create({
    generateReport: true
  });
  
  // 2. 启动应用
  await agent.interface.startApp('com.example.app');
  
  // 3. 执行自动化任务
  await agent.aiAction('点击首页的搜索按钮');
  await agent.aiInput('搜索框', { value: 'Midscene' });
  await agent.aiTap('搜索结果中的第一项');
  
  // 4. 数据提取
  const title = await agent.aiQuery<string>('获取当前页面标题');
  console.log('标题:', title);
  
  // 5. 断言
  await agent.aiAssert('页面显示详情信息');
  
  // 6. 清理
  await agent.destroy();
}

main();
```

#### 5.3.3 使用 Android Playground

```bash
# 启动 Android Playground
npx @midscene/android-playground

# 浏览器打开 http://localhost:3000
# 在界面中选择设备并进行可视化操作
```

### 5.4 iOS 自动化使用

#### 5.4.1 环境准备

```bash
# 安装 WebDriverAgent
# 参考官方文档: https://midscenejs.com/zh/integrate-with-ios

# 启动 WebDriverAgent
# 在 Xcode 中运行 WebDriverAgent 项目
```

#### 5.4.2 代码示例

```typescript
import { IOSAgent } from '@midscene/ios';

async function main() {
  // 1. 创建 Agent
  const agent = await IOSAgent.create({
    deviceId: 'your-device-udid',  // 或使用模拟器
    wdaPort: 8100,
    generateReport: true
  });
  
  // 2. 启动应用
  await agent.interface.launchApp('com.example.app');
  
  // 3. 执行自动化任务
  await agent.aiTap('登录按钮');
  await agent.aiInput('用户名', { value: 'test' });
  await agent.aiInput('密码', { value: 'password' });
  await agent.aiTap('提交');
  
  // 4. 等待条件
  await agent.aiWaitFor('显示主页', { timeoutMs: 10000 });
  
  // 5. 清理
  await agent.destroy();
}

main();
```

### 5.5 YAML 脚本使用

#### 5.5.1 编写 YAML 脚本

创建 `test.yaml`:

```yaml
# 环境配置
env:
  type: web
  url: https://example.com
  headless: false

# 任务列表
tasks:
  - name: "用户登录测试"
    flow:
      - aiAction: "点击登录按钮"
      - aiInput:
          locate: "用户名输入框"
          value: "test@example.com"
      - aiInput:
          locate: "密码输入框"
          value: "password123"
      - aiTap: "提交按钮"
      - aiAssert: "页面显示欢迎信息"
      - aiQuery:
          demand: "string, 获取用户名"
          saveAs: "username"
  
  - name: "搜索功能测试"
    flow:
      - aiTap: "搜索图标"
      - aiInput:
          locate: "搜索输入框"
          value: "Midscene.js"
      - aiAction: "点击搜索按钮并等待结果加载"
      - aiQuery:
          demand: "string[], 提取所有搜索结果的标题"
          saveAs: "searchResults"
      - aiAssert: "搜索结果不为空"
```

#### 5.5.2 执行 YAML 脚本

```bash
# 使用 CLI 执行
npx midscene run test.yaml

# 批量执行
npx midscene run tests/*.yaml

# 指定输出目录
npx midscene run test.yaml --output ./reports
```

#### 5.5.3 在代码中执行 YAML

```typescript
import { Agent } from '@midscene/core';
import fs from 'fs';

async function main() {
  const agent = await createAgent(/* ... */);
  
  // 读取 YAML 文件
  const yamlContent = fs.readFileSync('test.yaml', 'utf-8');
  
  // 执行 YAML 脚本
  const result = await agent.runYaml(yamlContent);
  
  console.log('执行结果:', result);
  // result = { username: 'test', searchResults: ['...', '...'] }
}
```

### 5.6 缓存使用

#### 5.6.1 启用缓存

```typescript
const agent = await PuppeteerAgent.create(page, {
  cache: {
    enabled: true,
    id: 'my-test-cache',  // 缓存标识
    strategy: 'read-write'  // 'read-only', 'write-only', 'read-write'
  }
});

// 第一次执行会调用 AI
await agent.aiAction('点击登录按钮');

// 第二次执行会使用缓存
await agent.aiAction('点击登录按钮');  // 从缓存读取，不调用 AI
```

#### 5.6.2 环境变量配置

```bash
# 启用缓存
MIDSCENE_CACHE=true

# 缓存策略
MIDSCENE_CACHE_STRATEGY=read-write

# 缓存目录
MIDSCENE_CACHE_DIR=./cache
```

### 5.7 报告查看

#### 5.7.1 自动生成报告

```typescript
const agent = await PuppeteerAgent.create(page, {
  generateReport: true,  // 启用报告生成
  autoPrintReportMsg: true,  // 自动打印报告路径
  groupName: '我的测试组',
  groupDescription: '这是一个测试组的描述'
});

// 执行任务后会自动生成报告
await agent.aiAction('执行某个任务');

// 报告路径会打印到控制台
// Report: file:///path/to/midscene_run/report_xxx.html
```

#### 5.7.2 手动生成报告

```typescript
// 获取报告 HTML
const htmlContent = agent.reportHTMLString();

// 写入文件
fs.writeFileSync('report.html', htmlContent);

// 或者获取数据 JSON
const dumpData = agent.dumpDataString();
fs.writeFileSync('report.json', dumpData);
```

#### 5.7.3 报告内容

报告包含：
- 执行时间线
- 每个步骤的截图
- AI 模型的思考过程
- 元素定位的可视化
- 执行结果和错误信息
- 可回放的操作序列

### 5.8 调试技巧

#### 5.8.1 启用调试日志

```bash
# 启用所有调试日志
DEBUG=midscene:* node your-script.js

# 只启用特定模块
DEBUG=midscene:agent node your-script.js
DEBUG=midscene:ai-model node your-script.js
```

#### 5.8.2 使用 Playground 调试

```typescript
import { playgroundForAgent } from '@midscene/playground';

const agent = await PuppeteerAgent.create(page);

// 启动 Playground
await playgroundForAgent(agent, {
  port: 3000
});

// 浏览器打开 http://localhost:3000
// 在 Playground 中可视化调试
```

#### 5.8.3 冻结页面上下文

```typescript
// 冻结当前页面状态，后续操作都使用这个快照
await agent.freezePageContext();

// 多次调用 AI 都使用同一个页面快照
await agent.aiQuery('提取标题');
await agent.aiQuery('提取价格');
await agent.aiQuery('提取描述');

// 解冻
await agent.unfreezePageContext();
```

#### 5.8.4 验证定位器

```typescript
// 描述元素并验证
const result = await agent.describeElementAtPoint(
  [100, 200],  // 元素中心坐标
  {
    verifyPrompt: true,  // 验证生成的描述是否能定位回原位置
    retryLimit: 3,
    deepThink: true  // 使用深度思考模式
  }
);

console.log('元素描述:', result.prompt);
console.log('验证结果:', result.verifyResult);
```

### 5.9 高级用法

#### 5.9.1 自定义 AI 模型配置

```typescript
import { ModelConfigManager } from '@midscene/shared/env';

const agent = await PuppeteerAgent.create(page, {
  modelConfig: () => {
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096
    };
  }
});
```

#### 5.9.2 自定义动作空间

```typescript
// 扩展设备的动作空间
class CustomPuppeteerPage extends PuppeteerPage {
  async actionSpace(): Promise<DeviceAction[]> {
    const baseActions = await super.actionSpace();
    
    // 添加自定义动作
    return [
      ...baseActions,
      {
        type: 'CustomAction',
        execute: async (param) => {
          // 自定义动作实现
          console.log('执行自定义动作:', param);
        }
      }
    ];
  }
}
```

#### 5.9.3 监听任务执行

```typescript
const agent = await PuppeteerAgent.create(page, {
  onTaskStartTip: async (tip) => {
    console.log('开始执行:', tip);
  },
  onDumpUpdate: (dumpData) => {
    console.log('执行记录更新:', dumpData);
  }
});
```

#### 5.9.4 使用 AI 上下文

```typescript
// 设置全局上下文，影响所有 AI 操作
await agent.setAIActionContext(`
  当前用户角色: 管理员
  当前页面: 用户管理页面
  注意事项: 操作前需要确认权限
`);

// 后续的 AI 操作都会考虑这个上下文
await agent.aiAction('删除用户');
```

---


## 6. 二次开发指南

### 6.1 开发环境搭建

#### 6.1.1 Fork 和克隆项目

```bash
# Fork 项目到你的 GitHub 账号
# 然后克隆
git clone https://github.com/your-username/midscene.git
cd midscene

# 添加上游仓库
git remote add upstream https://github.com/web-infra-dev/midscene.git
```

#### 6.1.2 安装和构建

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm run build

# 开发模式（监听文件变化）
pnpm run dev
```

#### 6.1.3 运行测试

```bash
# 运行单元测试
pnpm run test

# 运行 AI 测试（需要配置 API Key）
pnpm run test:ai

# 运行 E2E 测试
pnpm run e2e
```

### 6.2 添加新的平台支持

#### 6.2.1 创建新的设备接口

假设要添加对桌面应用的支持：

```typescript
// packages/desktop/src/device.ts
import { AbstractInterface, DeviceAction, UIContext } from '@midscene/core';

export class DesktopDevice implements AbstractInterface {
  interfaceType = 'desktop';
  
  constructor(private appPath: string) {}
  
  async actionSpace(): Promise<DeviceAction[]> {
    return [
      {
        type: 'Tap',
        execute: async (param) => {
          // 使用桌面自动化工具（如 robotjs）实现点击
          const [x, y] = param.element.center;
          robot.moveMouse(x, y);
          robot.mouseClick();
        }
      },
      {
        type: 'Input',
        execute: async (param) => {
          // 实现输入
          robot.typeString(param.value);
        }
      },
      {
        type: 'KeyboardPress',
        execute: async (param) => {
          robot.keyTap(param.keyName);
        }
      }
    ];
  }
  
  async getContext(): Promise<UIContext> {
    // 获取屏幕截图
    const screenshot = await this.captureScreen();
    
    // 获取窗口尺寸
    const size = await this.getWindowSize();
    
    return {
      screenshotBase64: screenshot,
      size,
      extra: {
        appPath: this.appPath
      }
    };
  }
  
  async size(): Promise<{ width: number; height: number }> {
    return this.getWindowSize();
  }
  
  private async captureScreen(): Promise<string> {
    // 实现屏幕截图
    const bitmap = robot.screen.capture();
    const buffer = Buffer.from(bitmap.image);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }
  
  private async getWindowSize(): Promise<{ width: number; height: number }> {
    // 获取窗口尺寸
    const screenSize = robot.getScreenSize();
    return {
      width: screenSize.width,
      height: screenSize.height
    };
  }
}
```

#### 6.2.2 创建 Agent 类

```typescript
// packages/desktop/src/agent.ts
import { Agent, AgentOpt } from '@midscene/core';
import { DesktopDevice } from './device';

export class DesktopAgent extends Agent<DesktopDevice> {
  static async create(
    appPath: string,
    opts?: AgentOpt
  ): Promise<DesktopAgent> {
    const device = new DesktopDevice(appPath);
    return new DesktopAgent(device, opts);
  }
  
  // 可以添加平台特定的方法
  async launchApp(): Promise<void> {
    // 启动应用
  }
  
  async closeApp(): Promise<void> {
    // 关闭应用
  }
}
```

#### 6.2.3 添加包配置

```json
// packages/desktop/package.json
{
  "name": "@midscene/desktop",
  "version": "0.30.8",
  "main": "./dist/lib/index.js",
  "module": "./dist/es/index.mjs",
  "types": "./dist/types/index.d.ts",
  "dependencies": {
    "@midscene/core": "workspace:*",
    "@midscene/shared": "workspace:*",
    "robotjs": "^0.6.0"
  }
}
```

### 6.3 自定义 UI 界面开发

#### 6.3.1 创建自定义 Playground

```typescript
// apps/my-playground/src/App.tsx
import React, { useState } from 'react';
import { UniversalPlayground } from '@midscene/visualizer';
import { PlaygroundSDK } from '@midscene/playground';

export default function MyPlayground() {
  const [sdk] = useState(() => new PlaygroundSDK({
    serverUrl: 'http://localhost:3000'
  }));
  
  return (
    <UniversalPlayground
      sdk={sdk}
      branding={{
        title: '我的自定义 Playground',
        logo: '/my-logo.png',
        primaryColor: '#1890ff'
      }}
      config={{
        showAdvancedOptions: true,
        defaultExecutionType: 'local',
        enableCache: true
      }}
    />
  );
}
```

#### 6.3.2 自定义报告界面

```typescript
// apps/my-report/src/App.tsx
import React from 'react';
import { ReportData } from '@midscene/core';

interface MyReportProps {
  data: ReportData;
}

export function MyReport({ data }: MyReportProps) {
  return (
    <div className="my-report">
      <header>
        <h1>{data.groupName}</h1>
        <p>{data.groupDescription}</p>
      </header>
      
      <div className="executions">
        {data.executions.map((execution, index) => (
          <div key={index} className="execution-item">
            <h2>{execution.title}</h2>
            
            {/* 显示截图 */}
            <img src={execution.context.screenshotBase64} alt="screenshot" />
            
            {/* 显示任务列表 */}
            <ul>
              {execution.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  <span className={`status-${task.status}`}>
                    {task.type} - {task.status}
                  </span>
                  {task.errorMessage && (
                    <div className="error">{task.errorMessage}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 6.3.3 集成到现有应用

```typescript
// 在你的 React 应用中集成 Midscene 组件
import { ContextPreview, Player } from '@midscene/visualizer';
import { Agent } from '@midscene/core';

function MyApp() {
  const [agent, setAgent] = useState<Agent>();
  const [context, setContext] = useState();
  
  useEffect(() => {
    // 创建 Agent
    const initAgent = async () => {
      const newAgent = await createMyAgent();
      setAgent(newAgent);
      
      // 获取上下文
      const ctx = await newAgent.getUIContext();
      setContext(ctx);
    };
    
    initAgent();
  }, []);
  
  return (
    <div>
      {/* 显示页面上下文 */}
      {context && <ContextPreview context={context} />}
      
      {/* 执行按钮 */}
      <button onClick={() => agent?.aiAction('执行某个任务')}>
        执行任务
      </button>
      
      {/* 回放器 */}
      <Player dump={agent?.dump} />
    </div>
  );
}
```

### 6.4 添加新的 AI 模型支持

#### 6.4.1 实现模型适配器

```typescript
// packages/core/src/ai-model/providers/my-model.ts
import { ModelConfig, AIResponse } from '../types';

export async function callMyModel(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<AIResponse> {
  // 1. 构建请求
  const request = {
    model: config.model,
    messages: messages.map(msg => ({
      role: msg.role,
      content: formatContent(msg.content)
    })),
    temperature: config.temperature,
    max_tokens: config.maxTokens
  };
  
  // 2. 调用 API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  
  const data = await response.json();
  
  // 3. 解析响应
  return {
    content: data.choices[0].message.content,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    }
  };
}

function formatContent(content: any): any {
  // 格式化内容，处理图片等多模态输入
  if (Array.isArray(content)) {
    return content.map(item => {
      if (item.type === 'image_url') {
        return {
          type: 'image',
          image: item.image_url.url
        };
      }
      return item;
    });
  }
  return content;
}
```

#### 6.4.2 注册模型提供商

```typescript
// packages/core/src/ai-model/service-caller/index.ts
import { callMyModel } from '../providers/my-model';

export async function callAI(
  messages: ChatMessage[],
  config: ModelConfig
): Promise<AIResponse> {
  const provider = config.provider;
  
  switch (provider) {
    case 'openai':
      return callOpenAI(messages, config);
    case 'anthropic':
      return callAnthropic(messages, config);
    case 'my-model':  // 添加新的提供商
      return callMyModel(messages, config);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

#### 6.4.3 使用新模型

```typescript
const agent = await PuppeteerAgent.create(page, {
  modelConfig: () => ({
    provider: 'my-model',
    apiKey: process.env.MY_MODEL_API_KEY,
    baseURL: 'https://api.mymodel.com/v1',
    model: 'my-model-v1',
    temperature: 0.7
  })
});
```

### 6.5 扩展功能模块

#### 6.5.1 添加新的 Insight 功能

```typescript
// packages/core/src/insight/custom-insight.ts
import { Insight } from './index';

export class CustomInsight extends Insight {
  // 添加自定义的数据提取方法
  async extractTable(
    tableLocator: string
  ): Promise<Array<Record<string, any>>> {
    const context = await this.getContext();
    
    // 使用 AI 提取表格数据
    const prompt = `从页面中提取表格 "${tableLocator}" 的所有数据，返回 JSON 数组格式`;
    
    const result = await this.query(prompt, {
      schema: z.array(z.record(z.any()))
    });
    
    return result;
  }
  
  // 添加图表识别功能
  async recognizeChart(
    chartLocator: string
  ): Promise<{
    type: string;
    data: any;
  }> {
    const context = await this.getContext();
    
    const prompt = `识别页面中的图表 "${chartLocator}"，返回图表类型和数据`;
    
    const result = await this.query(prompt, {
      schema: z.object({
        type: z.string(),
        data: z.any()
      })
    });
    
    return result;
  }
}
```

#### 6.5.2 添加新的缓存策略

```typescript
// packages/core/src/agent/cache-strategies/redis-cache.ts
import { CacheStrategy } from '../task-cache';
import Redis from 'ioredis';

export class RedisCacheStrategy implements CacheStrategy {
  private redis: Redis;
  
  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }
  
  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }
  
  async has(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }
  
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
```

### 6.6 贡献代码

#### 6.6.1 代码规范

```bash
# 运行代码检查
pnpm run lint

# 自动修复格式问题
pnpm run format

# 检查拼写
pnpm run check-spell
```

#### 6.6.2 提交规范

使用 Conventional Commits 规范：

```bash
# 功能添加
git commit -m "feat: 添加桌面平台支持"

# Bug 修复
git commit -m "fix: 修复 Android 输入法问题"

# 文档更新
git commit -m "docs: 更新 API 文档"

# 性能优化
git commit -m "perf: 优化图片处理性能"

# 重构
git commit -m "refactor: 重构 Agent 类结构"
```

#### 6.6.3 提交 Pull Request

```bash
# 1. 创建功能分支
git checkout -b feature/my-new-feature

# 2. 提交更改
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到你的 Fork
git push origin feature/my-new-feature

# 4. 在 GitHub 上创建 Pull Request
```

### 6.7 调试和测试

#### 6.7.1 单元测试

```typescript
// packages/my-package/tests/unit-test/my-feature.test.ts
import { describe, it, expect } from 'vitest';
import { MyFeature } from '../src/my-feature';

describe('MyFeature', () => {
  it('should work correctly', () => {
    const feature = new MyFeature();
    const result = feature.doSomething();
    expect(result).toBe('expected value');
  });
  
  it('should handle errors', () => {
    const feature = new MyFeature();
    expect(() => feature.doSomethingWrong()).toThrow();
  });
});
```

#### 6.7.2 AI 测试

```typescript
// packages/my-package/tests/ai/my-ai-feature.test.ts
import { describe, it, expect } from 'vitest';
import { Agent } from '@midscene/core';

describe('AI Feature', () => {
  it('should locate element correctly', async () => {
    const agent = await createTestAgent();
    
    const result = await agent.aiLocate('登录按钮');
    
    expect(result.center).toBeDefined();
    expect(result.rect).toBeDefined();
  });
});
```

#### 6.7.3 E2E 测试

```typescript
// packages/my-package/tests/e2e/my-flow.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightAgent } from '@midscene/web/playwright';

test('complete user flow', async ({ page }) => {
  const agent = await PlaywrightAgent.create(page);
  
  await page.goto('https://example.com');
  
  await agent.aiAction('完成用户注册流程');
  
  const username = await agent.aiQuery<string>('获取当前用户名');
  expect(username).toBeTruthy();
});
```

### 6.8 发布和部署

#### 6.8.1 版本管理

```bash
# 使用 Changesets 管理版本
npx changeset

# 选择要更新的包和版本类型
# - patch: 0.30.8 -> 0.30.9
# - minor: 0.30.8 -> 0.31.0
# - major: 0.30.8 -> 1.0.0

# 生成 CHANGELOG
npx changeset version

# 发布到 npm
npx changeset publish
```

#### 6.8.2 构建优化

```typescript
// rslib.config.ts
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      output: {
        distPath: { root: './dist/es' }
      }
    },
    {
      format: 'cjs',
      output: {
        distPath: { root: './dist/lib' }
      }
    }
  ],
  output: {
    target: 'node'
  }
});
```

### 6.9 常见问题和解决方案

#### 6.9.1 模型调用失败

```typescript
// 添加重试机制
async function callAIWithRetry(
  messages: ChatMessage[],
  config: ModelConfig,
  maxRetries = 3
): Promise<AIResponse> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callAI(messages, config);
    } catch (error) {
      lastError = error;
      console.warn(`AI 调用失败，重试 ${i + 1}/${maxRetries}`, error);
      await sleep(1000 * (i + 1));  // 指数退避
    }
  }
  
  throw lastError;
}
```

#### 6.9.2 元素定位不准确

```typescript
// 使用深度思考模式
const result = await agent.aiLocate('登录按钮', {
  deepThink: true,  // 启用深度思考
  retryLimit: 3     // 增加重试次数
});

// 或者提供更详细的描述
const result = await agent.aiLocate(
  '页面右上角的蓝色登录按钮，文字为"登录"'
);
```

#### 6.9.3 性能优化

```typescript
// 1. 使用缓存
const agent = await PuppeteerAgent.create(page, {
  cache: { enabled: true, strategy: 'read-write' }
});

// 2. 冻结页面上下文（多次查询同一页面）
await agent.freezePageContext();
const title = await agent.aiQuery('标题');
const price = await agent.aiQuery('价格');
await agent.unfreezePageContext();

// 3. 批量操作
const results = await Promise.all([
  agent.aiQuery('标题'),
  agent.aiQuery('价格'),
  agent.aiQuery('描述')
]);
```

---

## 7. 附录

### 7.1 环境变量参考

```bash
# AI 模型配置
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
ANTHROPIC_API_KEY=sk-ant-xxx
GEMINI_API_KEY=xxx
QWEN_API_KEY=sk-xxx
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 模型选择
MIDSCENE_MODEL_NAME=gpt-4o
MIDSCENE_VL_MODE=vlm  # 或 vlm-ui-tars

# 缓存配置
MIDSCENE_CACHE=true
MIDSCENE_CACHE_STRATEGY=read-write
MIDSCENE_CACHE_DIR=./cache

# 报告配置
MIDSCENE_OUTPUT_DIR=./midscene_run
MIDSCENE_REPORT=true

# 调试
DEBUG=midscene:*
MIDSCENE_LOG_LEVEL=debug

# 代理配置
HTTP_PROXY=http://proxy.example.com:8080
HTTPS_PROXY=http://proxy.example.com:8080
```

### 7.2 API 速查表

#### Agent 核心方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `aiAction(prompt)` | 自动规划并执行任务 | `await agent.aiAction('完成登录')` |
| `aiTap(locate)` | 点击元素 | `await agent.aiTap('登录按钮')` |
| `aiInput(locate, {value})` | 输入文本 | `await agent.aiInput('用户名', {value: 'test'})` |
| `aiQuery<T>(demand)` | 提取数据 | `await agent.aiQuery<string>('获取标题')` |
| `aiAssert(assertion)` | 执行断言 | `await agent.aiAssert('显示成功消息')` |
| `aiLocate(prompt)` | 定位元素 | `await agent.aiLocate('搜索按钮')` |
| `aiWaitFor(condition)` | 等待条件 | `await agent.aiWaitFor('页面加载完成')` |
| `runYaml(yaml)` | 执行 YAML 脚本 | `await agent.runYaml(yamlContent)` |

#### 配置选项

```typescript
interface AgentOpt {
  generateReport?: boolean;        // 是否生成报告
  autoPrintReportMsg?: boolean;    // 是否自动打印报告路径
  groupName?: string;              // 报告组名
  groupDescription?: string;       // 报告组描述
  cache?: CacheConfig;             // 缓存配置
  modelConfig?: () => ModelConfig; // 模型配置
  onTaskStartTip?: (tip: string) => void;  // 任务开始回调
  onDumpUpdate?: (dump: string) => void;   // 执行记录更新回调
}
```

### 7.3 常用命令

```bash
# 开发
pnpm run dev                    # 开发模式
pnpm run build                  # 构建所有包
pnpm run test                   # 运行测试
pnpm run lint                   # 代码检查

# CLI 使用
npx midscene run script.yaml    # 执行 YAML 脚本
npx midscene run tests/*.yaml   # 批量执行

# Playground
npx @midscene/android-playground  # Android Playground
npx @midscene/ios-playground      # iOS Playground
npx midscene-playground           # Web Playground
```

### 7.4 相关资源

- **官方网站**: https://midscenejs.com
- **GitHub**: https://github.com/web-infra-dev/midscene
- **示例项目**: https://github.com/web-infra-dev/midscene-example
- **Discord 社区**: https://discord.gg/2JyBHxszE4
- **飞书交流群**: https://applink.larkoffice.com/client/chat/chatter/add_by_link?link_token=291q2b25-e913-411a-8c51-191e59aab14d

### 7.5 更新日志

查看 [CHANGELOG.md](https://github.com/web-infra-dev/midscene/blob/main/CHANGELOG.md) 获取详细的版本更新信息。

---

## 结语

本文档详细介绍了 Midscene.js 项目的代码结构、架构设计、核心实现和使用方法。对于二次开发和功能迭代，建议：

1. **熟悉核心概念**: 理解 Agent、Insight、Executor 等核心类的职责和关系
2. **阅读源码**: 从 `packages/core` 开始，逐步深入各个模块
3. **运行示例**: 通过官方示例项目快速上手
4. **参与社区**: 加入 Discord 或飞书群，与其他开发者交流
5. **贡献代码**: 遵循代码规范，提交高质量的 Pull Request

如有任何问题或建议，欢迎在 GitHub 上提 Issue 或参与讨论。

---

**文档维护**: 本文档会随着项目更新而持续维护，建议定期查看最新版本。

**最后更新**: 2025-01-11  
**文档版本**: v1.0  
**项目版本**: 0.30.8
