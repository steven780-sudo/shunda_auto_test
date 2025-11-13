# 基于 Midscene.js 的 AI 驱动自动化测试平台 - 产品需求文档(PRD)

> **作者**: 孙顺达
> **文档版本**: v1.0
> **创建日期**: 2025-11-12
> **基础框架**: Midscene.js v0.30.8
> **项目代号**: 数字员工 AUTO_TEST

---

## 📋 目录

- [一、产品定位与愿景](#一产品定位与愿景)
- [二、产品架构设计](#二产品架构设计)
- [三、核心功能设计](#三核心功能设计)
- [四、MVP 实施方案](#四mvp-实施方案)
- [五、后续迭代计划](#五后续迭代计划)
- [六、技术实现细节](#六技术实现细节)
- [七、UI 界面设计](#七ui-界面设计)
- [八、风险与挑战](#八风险与挑战)
- [九、成功指标](#九成功指标)
- [十、总结](#十总结)

---

## 一、产品定位与愿景

### 1.1 问题陈述

**传统 UI 自动化测试的痛点：**

1. **高技术门槛**: 需要编写代码、维护元素选择器
2. **效率低下**: 手工编写测试用例耗时长
3. **维护成本高**: UI 变化后大量用例需要更新
4. **覆盖不全**: 人工梳理系统结构容易遗漏

### 1.2 产品定位

**基于 Midscene.js 框架，打造一个从 PRD 到测试用例再到自动化执行的完整 AI 驱动测试平台。**

### 1.3 核心价值主张

> "让 AI 理解需求、生成用例、执行测试，让测试人员专注于业务逻辑"

**三大核心价值：**

1. **降低测试门槛**: 无需编写代码，使用自然语言描述即可
2. **提升测试效率**: AI 自动生成测试用例，自动执行测试
3. **完整闭环**: PRD → 测试用例 → 自动化执行 → 测试报告

### 1.4 目标用户

| 用户角色 | 使用场景 | 核心需求 |
|---------|---------|---------|
| 测试工程师 | 日常测试工作 | 快速生成和执行测试用例 |
| 产品经理 | 需求验收 | 从 PRD 快速验证功能 |
| 开发工程师 | 自测 | 快速验证功能是否符合预期 |
| QA 团队 | 回归测试 | 批量执行测试，生成报告 |

### 1.5 产品最终形态（两阶段工作模式）

```
┌─────────────────────────────────────────────────────────┐
│ 阶段 A: 智能探索 (迭代 3 实现)                           │
│                                                          │
│ 输入: 系统首页 URL                                       │
│   ↓                                                      │
│ AI 自动遍历页面 → 生成页面树 → 提取功能清单              │
│   ↓                                                      │
│ 输出: 页面结构图 + 功能清单 + 截图库                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 阶段 B: 智能测试 (MVP 实现基础版)                        │
│                                                          │
│ 输入: PRD 文档                                           │
│   ↓                                                      │
│ AI 生成 YAML 测试用例 → 执行测试 → 生成报告              │
│   ↓                                                      │
│ 输出: 测试报告 (Pass/Fail) + 执行截图 + 错误日志         │
└─────────────────────────────────────────────────────────┘
```

---

## 二、产品架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Gradio WebUI 展示层                                           │
│    ┌──────┬──────┬──────┬──────┬──────┬──────┐                  │
│    │ LLM  │ 浏览器│ 测试  │ PRD  │ 测试  │ 操作 │                  │
│    │ 配置 │ 设置 │ 用例  │ 生成 │ 执行  │ 说明 │                  │
│    │      │      │ 管理  │ 用例 │      │      │                  │
│    └──────┴──────┴──────┴──────┴──────┴──────┘                  │
│    - 中文化界面                                                   │
│    - 蓝色主题 (#005BF5)                                          │
│    - Logo + 版权信息                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. 业务交互层 (Python - 新增)                                    │
│    ┌─────────────┬─────────────┬─────────────┐                  │
│    │PRDProcessor │TestCaseManager│ReportGenerator│                │
│    ├─────────────┼─────────────┼─────────────┤                  │
│    │PRD审查      │YAML解析     │报告生成     │                  │
│    │YAML生成     │用例验证     │历史记录     │                  │
│    │多轮对话     │执行管理     │数据统计     │                  │
│    └─────────────┴─────────────┴─────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Midscene 桥接层 (Node.js - 新增)                              │
│    ┌─────────────────────────────────────────┐                  │
│    │ execute.js (subprocess 调用)            │                  │
│    │ - Python ←→ Node.js 通信               │                  │
│    │ - 配置管理                              │                  │
│    │ - 错误处理                              │                  │
│    └─────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Midscene 核心层 (TypeScript - 复用现有)                       │
│    ┌──────────┬──────────┬──────────┬──────────┐               │
│    │ Agent    │ YAML     │ Insight  │ TaskCache│               │
│    │          │ Player   │          │          │               │
│    ├──────────┼──────────┼──────────┼──────────┤               │
│    │任务执行  │脚本解析  │元素定位  │结果缓存  │               │
│    │流程控制  │指令执行  │数据提取  │性能优化  │               │
│    └──────────┴──────────┴──────────┴──────────┘               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. 浏览器自动化层 (Midscene 已集成)                              │
│    ┌─────────────────────────────────────────┐                  │
│    │ Puppeteer / Playwright                  │                  │
│    └─────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                      ┌───────────┐
                      │  浏览器    │
                      └───────────┘
```

### 2.2 核心设计原则

| 原则 | 说明 | 体现 |
|-----|------|------|
| **解耦** | 业务层不直接操作浏览器 | 通过 Midscene Agent 间接控制 |
| **复用** | 最大化利用 Midscene 能力 | YAML Player、报告系统、缓存机制 |
| **标准化** | 统一测试用例格式 | 基于 Midscene YAML 标准 |
| **可扩展** | 支持后续功能迭代 | 模块化设计，清晰接口 |

### 2.3 数据流设计

```
用户上传 PRD (Markdown)
    ↓
PRDProcessor 解析 PRD (Python)
    ↓
调用 LLM 生成 YAML (DeepSeek-V3)
    ↓
TestCaseManager 验证 YAML (Python)
    ↓
subprocess 调用 Node.js (execute.js)
    ↓
Midscene Agent + YAML Player (TypeScript)
    ↓
Playwright 驱动浏览器 (TypeScript)
    ↓
生成测试报告 (HTML)
    ↓
ReportGenerator 解析报告 (Python)
    ↓
Gradio UI 展示结果
```

---

## 三、核心功能设计

### 3.1 功能模块总览

| 模块 | 功能描述 | MVP | 迭代2 | 迭代3 | 优先级 |
|------|---------|-----|-------|-------|-------|
| **LLM 配置** | 模型选择和 API Key 配置 | ✅ | ✅ | ✅ | P0 |
| **浏览器设置** | Playwright/Puppeteer 配置 | ✅ | ✅ | ✅ | P0 |
| **测试用例管理** | YAML 上传/解析/执行 | ✅ | 批量执行 | 优化建议 | P0 |
| **PRD 生成用例** | PRD → YAML 转换 | ✅ | 多轮审查 | 智能优化 | P0 |
| **测试执行** | 单用例执行和结果展示 | ✅ | 批量+并行 | 智能路径 | P0 |
| **操作说明** | 用户手册展示 | ✅ | ✅ | ✅ | P1 |
| **测试报告** | 执行结果可视化 | 简单展示 | HTML报告 | 历史对比 | P1 |
| **智能探索** | 页面自动遍历 | - | - | ✅ | P2 |
| **用例库管理** | 用例存储和检索 | - | - | ✅ | P2 |

### 3.2 详细功能设计

#### 3.2.1 测试用例管理 (Tab 3) - MVP 核心功能

**功能目标**: 让用户能够上传、管理和执行 YAML 格式的测试用例

**输入方式**:
1. 上传 YAML 文件
2. 直接在文本框中粘贴 YAML 内容
3. 下载标准模板参考

**YAML 测试用例格式** (基于 Midscene 标准):

```yaml
# 环境配置
web:
  url: https://example.com      # 测试网站 URL
  headless: false               # 是否无头模式
  viewport:                     # 可选: 视口大小
    width: 1920
    height: 1080

# 测试任务列表
tasks:
  - name: "用户登录功能测试"
    flow:
      # 1. 自然语言操作
      - aiAction: "点击页面右上角的登录按钮"

      # 2. 输入操作
      - aiInput:
          locate: "用户名输入框"
          value: "test@example.com"

      - aiInput:
          locate: "密码输入框"
          value: "password123"

      # 3. 点击操作
      - aiTap: "提交按钮"

      # 4. 断言验证
      - aiAssert: "页面显示欢迎信息,包含用户名"

      # 5. 数据提取
      - aiQuery:
          demand: "string, 获取当前登录用户名"
          name: username

      # 6. 等待条件
      - aiWaitFor: "页面完全加载"

  - name: "搜索功能测试"
    flow:
      - aiTap: "搜索图标"
      - aiInput:
          locate: "搜索输入框"
          value: "Midscene.js"
      - aiAction: "点击搜索按钮并等待结果加载"
      - aiQuery:
          demand: "array<string>, 提取所有搜索结果的标题"
          name: searchResults
      - aiAssert: "搜索结果不为空,至少有5条结果"
```

**处理流程**:

```
1. 用户上传/输入 YAML
    ↓
2. TestCaseManager.parse_yaml()
   - 解析 YAML 结构
   - 提取 tasks 列表
    ↓
3. TestCaseManager.validate_yaml()
   - 检查必填字段 (web.url, tasks)
   - 检查指令格式 (aiAction, aiTap 等)
   - 返回验证结果和错误信息
    ↓
4. 展示解析后的用例列表
   - 用例名称
   - 步骤数量
   - 预计执行时间
    ↓
5. 用户选择单个用例执行
    ↓
6. TestCaseManager.execute_yaml()
   - 保存 YAML 到临时文件
   - subprocess 调用 Node.js 执行脚本
   - 传递配置参数
    ↓
7. Node.js 执行 (execute.js)
   - 启动 Playwright/Puppeteer
   - 创建 Midscene Agent
   - 调用 agent.runYaml()
   - 生成测试报告
    ↓
8. 返回执行结果
   - 执行状态 (Success/Fail/Error)
   - 报告文件路径
   - 执行日志
    ↓
9. Gradio UI 展示
   - 执行状态图标 (✅/❌/⚠️)
   - 报告链接 (可点击查看)
   - 执行时长
   - 错误信息 (如果有)
```

**关键设计点**:

✅ **复用 Midscene YAML 标准**: 无需自定义格式，直接使用成熟的标准
✅ **复用 ScriptPlayer**: 无需重新开发执行引擎
✅ **复用报告系统**: Midscene 自动生成可视化 HTML 报告

**用户交互流程**:

```
┌────────────────────────────────────────┐
│ 1. [下载 YAML 模板] 按钮                │
│    ↓ 用户点击                           │
│    下载 testcase_template.yaml          │
└────────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ 2. 用户编辑 YAML 文件                   │
│    - 修改 URL                           │
│    - 填写测试步骤                       │
│    - 定义断言                           │
└────────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ 3. [上传文件] 或 [粘贴内容]             │
│    ↓ 用户操作                           │
│    点击 [解析用例] 按钮                  │
└────────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ 4. 系统展示解析结果                     │
│    ✅ 用例1: 用户登录测试 (5步)         │
│    ✅ 用例2: 搜索功能测试 (4步)         │
└────────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ 5. 用户选择用例,点击 [执行测试]         │
│    ↓                                    │
│    实时显示执行进度                     │
└────────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────┐
│ 6. 展示执行结果                         │
│    ✅ 测试通过 - 耗时 45s               │
│    [查看详细报告]                       │
└────────────────────────────────────────┘
```

#### 3.2.2 PRD 生成测试用例 (Tab 4) - MVP 核心功能

**功能目标**: 让用户上传 PRD 文档,AI 自动生成 YAML 测试用例

**输入格式**:
- Markdown 格式 PRD
- 纯文本 PRD
- 文件上传或直接粘贴

**PRD 示例**:

```markdown
# 用户登录功能 PRD

## 功能描述
用户可以通过用户名和密码登录系统。

## 功能需求
1. 页面右上角显示"登录"按钮
2. 点击"登录"按钮后,弹出登录表单
3. 表单包含:
   - 用户名输入框
   - 密码输入框
   - "提交"按钮
4. 输入正确的用户名和密码后,点击"提交"
5. 登录成功后:
   - 跳转到首页
   - 右上角显示用户名
   - "登录"按钮变为"退出"按钮

## 验收标准
- 正确的用户名密码可以成功登录
- 登录后页面显示用户信息
- 登录状态可以持久化
```

**处理流程**:

```
1. 用户上传/输入 PRD
    ↓
2. PRDProcessor.parse_prd()
   - 提取标题、功能描述、需求列表
   - 识别关键操作步骤
   - 识别验收标准
    ↓
3. PRDProcessor.generate_yaml()
   - 构建生成 Prompt
   - 调用 LLM (DeepSeek-V3)
   - 生成 YAML 内容
    ↓
4. 验证生成的 YAML
   - 检查格式是否正确
   - 检查是否包含必要字段
    ↓
5. 展示生成的 YAML
   - 可编辑的文本框
   - 语法高亮
    ↓
6. 提供操作选项
   - [下载 YAML] 保存到本地
   - [直接执行] 立即运行测试
   - [重新生成] 重新调用 LLM
```

**PRD → YAML 转换 Prompt** (MVP 简化版):

```
你是一个专业的测试用例设计专家。请根据以下 PRD 文档生成标准的 Midscene YAML 测试用例。

【PRD 内容】
{prd_content}

【生成要求】
1. 严格按照 Midscene YAML 格式
2. 使用以下 Midscene 指令:
   - aiAction: 自然语言描述的复杂操作
   - aiTap: 点击元素
   - aiInput: 输入文本
   - aiAssert: 断言验证
   - aiQuery: 数据提取
   - aiWaitFor: 等待条件
3. 为每个核心功能生成 1-2 个测试用例
4. 断言要明确、可验证
5. 操作步骤要清晰、具体

【输出格式】
请输出完整的 YAML 格式测试用例,包含:
- web 配置 (url, headless 等)
- tasks 列表 (至少 1 个任务)
- 每个任务包含 name 和 flow
- flow 中使用正确的 Midscene 指令

【重要提示】
- 从 PRD 中提取测试网站 URL,如果没有则使用 https://example.com
- 操作描述要具体,例如"点击页面右上角的登录按钮"而不是"点击登录"
- 断言要包含具体的验证条件,例如"页面显示欢迎信息,包含用户名"
- 数据提取要指定类型,例如"string, 获取用户名"

现在请生成 YAML 测试用例:
```

**生成的 YAML 示例**:

```yaml
web:
  url: https://example.com
  headless: false

tasks:
  - name: "用户登录功能-正常流程测试"
    flow:
      - aiAction: "找到页面右上角的登录按钮并点击"
      - aiWaitFor: "登录表单弹出或页面跳转到登录页"
      - aiInput:
          locate: "用户名输入框"
          value: "test@example.com"
      - aiInput:
          locate: "密码输入框"
          value: "password123"
      - aiTap: "提交按钮"
      - aiWaitFor: "页面完成跳转"
      - aiAssert: "页面URL包含首页地址或显示首页内容"
      - aiAssert: "页面右上角显示用户名信息"
      - aiAssert: "登录按钮已消失,出现退出按钮"
      - aiQuery:
          demand: "string, 提取页面显示的用户名"
          name: displayedUsername
```

**关键设计点**:

✅ **输出标准 Midscene YAML**: 可直接执行,无需转换
✅ **简化 Prompt**: MVP 阶段使用简单 Prompt,后续迭代优化
✅ **支持人工编辑**: 生成后用户可以修改

#### 3.2.3 测试执行与报告 (Tab 5)

**功能目标**: 执行测试用例并展示结果

**执行流程**:

```python
# 1. 用户选择测试用例
selected_testcase = "用例1: 用户登录测试"

# 2. 准备执行参数
config = {
    "yaml_path": "/tmp/testcase_12345.yaml",
    "output_dir": "./reports",
    "headless": ui_config["headless"],
    "browser": ui_config["browser"]  # playwright/puppeteer
}

# 3. 调用执行函数
result = testcase_manager.execute_yaml(
    yaml_path=config["yaml_path"],
    config=config
)

# 4. 解析结果
if result["status"] == "success":
    report_url = result["report_path"]
    execution_time = result["duration"]
    display_success(report_url, execution_time)
else:
    error_message = result["error"]
    display_error(error_message)
```

**Node.js 执行脚本** (execute.js):

```javascript
const { PlaywrightAgent } = require('@midscene/web/playwright');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function executeYaml(yamlPath, outputDir, options = {}) {
  const browser = await chromium.launch({
    headless: options.headless || false
  });

  const page = await browser.newPage();

  const agent = await PlaywrightAgent.create(page, {
    generateReport: true,
    groupName: '自动化测试执行',
    autoPrintReportMsg: false
  });

  try {
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
    const result = await agent.runYaml(yamlContent);

    // 获取报告路径
    const reportPath = agent.reportHTMLPath();

    // 返回结果
    console.log(JSON.stringify({
      status: 'success',
      result: result,
      report_path: reportPath,
      duration: agent.dump.totalDuration
    }));

  } catch (error) {
    console.error(JSON.stringify({
      status: 'error',
      error: error.message,
      stack: error.stack
    }));
  } finally {
    await browser.close();
  }
}

// 从命令行参数获取配置
const args = process.argv.slice(2);
const yamlPath = args[0];
const outputDir = args[1];
const options = JSON.parse(args[2] || '{}');

executeYaml(yamlPath, outputDir, options);
```

**测试报告展示** (复用 Midscene):

Midscene 自动生成的 HTML 报告包含:

- ✅ **执行时间线**: 每个步骤的执行时间
- ✅ **截图展示**: 每步操作的截图
- ✅ **AI 思考过程**: AI 的决策过程可视化
- ✅ **元素定位**: 高亮显示定位的元素
- ✅ **执行结果**: Pass/Fail 状态
- ✅ **错误信息**: 详细的错误堆栈

**UI 展示**:

```
┌────────────────────────────────────────┐
│ 执行结果:                               │
│                                        │
│ ✅ 测试通过                            │
│ 执行时长: 45.3 秒                       │
│ 任务数: 1                              │
│ 步骤数: 7                              │
│                                        │
│ [查看详细报告] [下载报告] [重新执行]    │
└────────────────────────────────────────┘
```

#### 3.2.4 LLM 配置 (Tab 1)

**功能目标**: 配置 AI 模型的 API Key 和参数

**配置项**:

| 配置项 | 说明 | 默认值 |
|-------|------|--------|
| 主模型提供商 | SiliconFlow / DeepSeek | SiliconFlow |
| 主模型 API Key | 访问密钥 | - |
| 主模型名称 | Qwen2.5-VL / Qwen3-VL | Qwen2.5-VL |
| 规划器提供商 | DeepSeek | DeepSeek |
| 规划器 API Key | 访问密钥 | - |
| 规划器模型 | DeepSeek-V3 | DeepSeek-V3 |
| Temperature | 生成温度 | 0.7 |
| Max Tokens | 最大 Token 数 | 4096 |

**保存方式**:
- 保存到 `.env` 文件
- 或保存到 `config.json`

**测试连接**:
- 提供"测试连接"按钮
- 调用 LLM API 验证配置是否正确

#### 3.2.5 浏览器设置 (Tab 2)

**配置项**:

| 配置项 | 说明 | 选项 |
|-------|------|------|
| 浏览器引擎 | 自动化工具 | Playwright / Puppeteer |
| 无头模式 | 是否显示浏览器窗口 | 是 / 否 |
| 窗口大小 | 浏览器窗口尺寸 | 1920x1080 / 1280x720 |
| 超时时间 | 操作超时时间 (秒) | 30 |
| 截图质量 | 报告截图质量 | 高 / 中 / 低 |

#### 3.2.6 操作说明 (Tab 6)

**内容**:
- 平台简介
- 快速开始指南
- LLM 配置教程
- YAML 编写规范
- PRD 编写建议
- 常见问题解答

**展示方式**:
- Markdown 渲染
- 支持代码高亮
- 支持图片展示

---

## 四、MVP 实施方案

### 4.1 MVP 范围定义

**✅ 包含功能**:

| 功能模块 | 功能点 | 实现方式 |
|---------|--------|---------|
| **Gradio WebUI** | 6个Tab页面 | Gradio + 自定义 CSS |
| **LLM 配置** | SiliconFlow + DeepSeek 配置 | .env 文件 |
| **浏览器设置** | Playwright/Puppeteer 选择 | 配置文件 |
| **测试用例管理** | YAML 上传/解析/执行 | Python + subprocess |
| **PRD 生成用例** | PRD → YAML 转换 | DeepSeek-V3 API |
| **测试执行** | 单用例执行 | Midscene Agent |
| **测试报告** | 简单结果展示 + 报告链接 | Midscene 报告 |
| **操作说明** | Markdown 文档展示 | Gradio Markdown |

**❌ 不包含 (后续迭代)**:

- 用例优化建议 (迭代 2)
- PRD 多轮审查 (迭代 2)
- 批量测试执行 (迭代 2)
- 并行测试执行 (迭代 2)
- 测试历史记录 (迭代 2)
- 性能优化 (缓存优化) (迭代 3)
- 智能页面遍历 (迭代 3)
- 用例库管理 (迭代 3)

### 4.2 MVP 技术架构

```
midscene-auto-test/
├── src/
│   ├── ui/                          # Gradio UI 层
│   │   ├── app.py                  # 主应用入口
│   │   ├── tabs/                   # 各个标签页
│   │   │   ├── llm_config_tab.py
│   │   │   ├── browser_settings_tab.py
│   │   │   ├── testcase_management_tab.py
│   │   │   ├── prd_to_testcase_tab.py
│   │   │   ├── test_execution_tab.py
│   │   │   └── user_guide_tab.py
│   │   └── components/             # 可复用 UI 组件
│   │       ├── file_uploader.py
│   │       ├── yaml_editor.py
│   │       └── result_display.py
│   │
│   ├── business/                   # 业务逻辑层
│   │   ├── __init__.py
│   │   ├── prd_processor.py       # PRD 处理
│   │   ├── testcase_manager.py    # 测试用例管理
│   │   └── report_generator.py    # 报告生成
│   │
│   ├── midscene_bridge/            # Midscene 桥接层
│   │   ├── execute.js             # Node.js 执行脚本
│   │   ├── config.js              # Midscene 配置
│   │   └── package.json           # Node.js 依赖
│   │
│   ├── utils/                      # 工具函数
│   │   ├── __init__.py
│   │   ├── config_loader.py       # 配置加载
│   │   ├── logger.py              # 日志工具
│   │   └── validators.py          # 验证工具
│   │
│   └── prompts/                    # Prompt 模板
│       ├── prd_to_yaml_prompt.txt
│       └── testcase_optimize_prompt.txt
│
├── templates/                      # YAML 模板
│   └── testcase_template.yaml
│
├── docs/                           # 文档
│   ├── user_guide.md
│   └── api_reference.md
│
├── tests/                          # 测试
│   ├── test_prd_processor.py
│   └── test_testcase_manager.py
│
├── reports/                        # 测试报告输出目录
├── logs/                           # 日志目录
├── .env.example                    # 环境变量示例
├── requirements.txt                # Python 依赖
├── package.json                    # Node.js 依赖 (Midscene)
└── README.md
```

### 4.3 MVP 实施计划 (5-7天)

#### **阶段 1: 项目基础搭建 (1-2天)**

**Day 1: 环境搭建**

- [ ] 创建项目目录结构
- [ ] 初始化 Git 仓库
- [ ] 安装 Python 依赖 (Gradio, PyYAML, requests 等)
- [ ] 安装 Midscene.js 依赖
- [ ] 配置 .env 文件
- [ ] 编写 Midscene 执行脚本 (execute.js)
- [ ] 测试 Python ↔ Node.js 通信

**Day 2: UI 框架搭建**

- [ ] 创建 Gradio 主应用 (app.py)
- [ ] 创建 6 个 Tab 页面结构
- [ ] 应用中文化和主题定制 (#005BF5)
- [ ] 添加 Logo 和版权信息
- [ ] 测试 UI 基本功能

#### **阶段 2: 核心功能开发 (3-4天)**

**Day 3: 测试用例管理**

- [ ] 实现 TestCaseManager 类
  - [ ] parse_yaml() - 解析 YAML
  - [ ] validate_yaml() - 验证格式
  - [ ] execute_yaml() - 执行测试
- [ ] 实现测试用例管理 Tab UI
  - [ ] 文件上传组件
  - [ ] YAML 编辑器
  - [ ] 用例列表展示
  - [ ] 执行按钮和进度显示
- [ ] 创建 YAML 模板文件
- [ ] 测试完整流程

**Day 4: PRD 生成用例**

- [ ] 实现 PRDProcessor 类
  - [ ] parse_prd() - 解析 PRD
  - [ ] generate_yaml() - 生成 YAML
- [ ] 集成 LLM API (DeepSeek-V3)
- [ ] 编写 PRD → YAML Prompt
- [ ] 实现 PRD 生成用例 Tab UI
  - [ ] PRD 上传组件
  - [ ] 生成按钮
  - [ ] YAML 结果展示
  - [ ] 下载和执行按钮
- [ ] 测试生成质量

**Day 5: LLM 和浏览器配置**

- [ ] 实现 LLM 配置 Tab
  - [ ] 配置表单
  - [ ] 保存功能
  - [ ] 测试连接功能
- [ ] 实现浏览器设置 Tab
  - [ ] 配置表单
  - [ ] 保存功能
- [ ] 完善配置加载逻辑

**Day 6: 测试报告和集成**

- [ ] 实现 ReportGenerator 类
  - [ ] 解析 Midscene 报告
  - [ ] 提取关键信息
- [ ] 优化测试执行流程
  - [ ] 错误处理
  - [ ] 日志记录
- [ ] 集成测试
  - [ ] PRD → YAML → 执行 → 报告 全流程
  - [ ] 修复集成问题

#### **阶段 3: 完善与交付 (1-2天)**

**Day 7: 文档和优化**

- [ ] 编写用户操作手册
- [ ] 实现操作说明 Tab
- [ ] 代码优化和重构
- [ ] 添加错误提示和帮助文本
- [ ] 性能测试和优化
- [ ] 准备示例 PRD 和 YAML 文件

**Day 8 (可选): 测试和部署**

- [ ] 端到端测试
- [ ] Bug 修复
- [ ] 部署到测试环境
- [ ] 用户试用和反馈收集

### 4.4 MVP 验收标准

**功能验收 (Must Have)**:

- [x] ✅ 可以上传 PRD 并生成 YAML 测试用例
- [x] ✅ 可以上传 YAML 测试用例并解析
- [x] ✅ 可以执行单个测试用例
- [x] ✅ 执行后生成测试报告并展示链接
- [x] ✅ 界面完全中文化,主题色为蓝色
- [x] ✅ LLM 配置功能正常
- [x] ✅ 浏览器设置功能正常
- [x] ✅ 操作说明文档完整

**质量验收 (Should Have)**:

- [x] ✅ 无崩溃和严重 Bug
- [x] ✅ 错误提示清晰友好
- [x] ✅ 关键操作有日志记录
- [x] ✅ 配置可持久化保存

**性能验收 (Nice to Have)**:

- [x] ✅ YAML 解析响应 < 2s
- [x] ✅ PRD 生成 YAML 响应 < 30s
- [x] ✅ 单个测试用例执行完成提示及时

---

## 五、后续迭代计划

### 5.1 迭代路线图

```
MVP (迭代 1)          迭代 2             迭代 3             迭代 4
5-7 天              2-3 周             3-4 周             2-3 周
─────────────────────────────────────────────────────────────────
基础能力            高级功能            智能化提升          协作与集成

- 单用例执行        - 批量执行          - 智能页面遍历      - 团队协作
- PRD 生成 YAML    - 用例优化          - 基于页面树测试    - 用例库管理
- 简单报告          - PRD 多轮审查      - 测试历史记录      - CI/CD 集成
- 基础配置          - HTML 报告         - 高级 Prompt      - 性能优化
```

### 5.2 迭代 2: 高级功能 (2-3周)

**目标**: 提升用户体验和测试效率

**新增功能**:

1. **批量测试执行**
   - 支持选择多个测试用例
   - 队列管理和进度展示
   - 失败后继续/停止策略
   - 批量测试汇总报告

2. **用例优化建议**
   - 上传测试用例后自动审查
   - AI 分析用例质量
   - 提供优化建议 (步骤合并、断言完善等)
   - 支持一键应用建议

3. **PRD 多轮审查**
   - PRD 完整性检查
   - 缺失信息识别
   - 交互式对话补充 PRD
   - 审查历史记录

4. **完整 HTML 报告**
   - 报告对比 (前后执行对比)
   - 趋势图表 (通过率、执行时长)
   - 导出功能 (PDF/Excel)
   - 分享链接

5. **用例编辑器**
   - 在线编辑 YAML
   - 语法高亮和自动补全
   - 实时验证
   - 版本历史

**技术改进**:

- 引入数据库 (SQLite) 存储历史记录
- 优化 LLM 调用 (重试机制、错误处理)
- 添加缓存层 (Redis 可选)

### 5.3 迭代 3: 智能化提升 (3-4周)

**目标**: 实现真正的 AI 驱动测试

**核心功能: 智能页面遍历**

**阶段 A: 智能探索**

```python
class IntelligentCrawler:
    """智能页面遍历器"""

    def __init__(self, start_url: str, max_depth: int = 3):
        self.start_url = start_url
        self.max_depth = max_depth
        self.visited_urls = set()
        self.page_tree = {}
        self.screenshots = {}

    async def crawl(self):
        """开始爬取"""
        queue = [(self.start_url, 0, None)]

        while queue:
            url, depth, parent = queue.pop(0)

            if depth > self.max_depth:
                continue

            # 规范化 URL (去参数)
            normalized_url = self.normalize_url(url)

            if normalized_url in self.visited_urls:
                continue

            # 访问页面
            page_info = await self.visit_page(url)

            # 记录页面信息
            self.visited_urls.add(normalized_url)
            self.page_tree[normalized_url] = page_info

            # 发现新链接
            for element in page_info['clickable_elements']:
                target_url = await self.click_and_get_url(url, element)
                if target_url:
                    queue.append((target_url, depth + 1, normalized_url))

        return self.generate_page_map()

    def normalize_url(self, url: str) -> str:
        """URL 规范化,去除查询参数"""
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    async def visit_page(self, url: str) -> dict:
        """访问页面,提取信息"""
        # 使用 Midscene Agent 访问页面
        agent = await self.create_agent()
        await agent.goto(url)

        # 截图
        screenshot = await agent.interface.screenshotBase64()

        # 使用 LLM 识别可点击元素
        elements = await agent.aiQuery("""
        分析当前页面,提取所有可点击的元素(链接、按钮)。
        返回 JSON 数组格式:
        [
          {"type": "link", "text": "登录", "location": "右上角"},
          {"type": "button", "text": "搜索", "location": "顶部"}
        ]
        """)

        return {
            'url': url,
            'title': await agent.aiQuery("string, 获取页面标题"),
            'screenshot': screenshot,
            'clickable_elements': elements
        }

    def generate_page_map(self) -> dict:
        """生成页面地图"""
        return {
            'total_pages': len(self.visited_urls),
            'page_tree': self.page_tree,
            'screenshots': self.screenshots
        }
```

**无限循环检测**:

```python
class LoopDetector:
    """无限循环检测器"""

    def __init__(self):
        self.url_pattern_cache = {}

    def is_pagination(self, url1: str, url2: str) -> bool:
        """检测是否为分页循环"""
        from urllib.parse import urlparse, parse_qs

        parsed1 = urlparse(url1)
        parsed2 = urlparse(url2)

        # 路径必须相同
        if parsed1.path != parsed2.path:
            return False

        # 检查是否只有 page 参数不同
        params1 = parse_qs(parsed1.query)
        params2 = parse_qs(parsed2.query)

        return (
            params1.keys() == params2.keys() and
            'page' in params1 and
            params1.get('page') != params2.get('page')
        )

    def detect_repeating_pattern(self, elements: list) -> list:
        """检测重复模式,去重"""
        unique_elements = {}
        for elem in elements:
            key = (elem['type'], elem['text'])
            if key not in unique_elements:
                unique_elements[key] = elem
        return list(unique_elements.values())
```

**阶段 B: 基于页面树的测试**

```yaml
# 使用页面树的测试用例
web:
  url: https://example.com
  use_page_tree: true  # 启用页面树
  page_tree_file: ./page_tree.json

tasks:
  - name: "基于页面树的登录测试"
    flow:
      # AI 会查阅页面树,知道登录入口位置
      - aiAction: "从首页进入登录页面"
      - aiInput:
          locate: "用户名"
          value: "test"
      - aiTap: "提交"
      - aiAssert: "进入用户中心"
```

**其他新增功能**:

1. **测试历史记录**
   - 所有执行记录存储
   - 历史查询和过滤
   - 执行趋势分析
   - 回归测试支持

2. **高级 Prompt 设计**
   - 精心设计的 PRD 审查 Prompt (包含示例)
   - 精心设计的用例生成 Prompt (Few-shot Learning)
   - 精心设计的用例优化 Prompt
   - Prompt 版本管理

3. **AI 助手**
   - 对话式用例生成
   - 智能问答 (如何编写 YAML)
   - 错误诊断和建议

### 5.4 迭代 4: 协作与集成 (2-3周)

**目标**: 支持团队协作和 CI/CD 集成

**新增功能**:

1. **用例库管理**
   - 用例分类和标签
   - 用例搜索和过滤
   - 用例复用和引用
   - 权限管理

2. **团队协作**
   - 多用户支持
   - 用例共享和评论
   - 审批流程
   - 通知系统

3. **CI/CD 集成**
   - Jenkins 插件
   - GitLab CI 集成
   - GitHub Actions 支持
   - Webhook 触发

4. **性能优化**
   - 利用 Midscene 缓存机制
   - 执行结果缓存
   - 并行测试执行
   - 资源池管理

5. **监控和告警**
   - 执行状态监控
   - 失败告警 (邮件/企业微信)
   - 性能指标统计
   - 日志分析

---

## 六、技术实现细节

### 6.1 关键技术选型

| 技术栈 | 选择 | 版本 | 理由 |
|--------|------|------|------|
| **前端框架** | Gradio | 4.x | 快速构建、Python 原生、适合内部工具 |
| **自动化引擎** | Midscene.js | 0.30.8 | 成熟稳定、YAML 标准、多平台支持 |
| **主 LLM** | Qwen2.5-VL | - | 视觉理解能力强、性价比高 |
| **规划器 LLM** | DeepSeek-V3 | - | 推理能力强、成本低 |
| **浏览器驱动** | Playwright | Latest | 现代化、跨浏览器、Midscene 已集成 |
| **Python 版本** | Python | 3.9+ | 主流版本,兼容性好 |
| **Node.js 版本** | Node.js | 18.19+ | Midscene 要求 |
| **包管理器** | pnpm | 9.3+ | Midscene 要求 |

### 6.2 Midscene 集成方案

**方案选择**: **Python subprocess 调用 Node.js**

**为什么选择跨语言调用?**

1. ✅ **Midscene 完整功能只在 Node.js 可用**
   - YAML Player、报告生成等核心功能无 Python 版本
   - TypeScript 实现,功能完整且稳定

2. ✅ **跨语言调用成本低于重新实现**
   - Midscene 有 8000+ 行代码
   - 重新实现需要 2-3 个月

3. ✅ **Gradio 需要 Python**
   - Gradio 是 Python 原生框架
   - 适合快速构建 UI

**实现方式**:

```python
# src/business/testcase_manager.py
import subprocess
import json
import os

class TestCaseManager:
    def __init__(self):
        self.node_script_path = os.path.join(
            os.path.dirname(__file__),
            '../midscene_bridge/execute.js'
        )

    def execute_yaml(
        self,
        yaml_path: str,
        config: dict
    ) -> dict:
        """执行 Midscene YAML 测试用例"""

        # 构建命令
        cmd = [
            'node',
            self.node_script_path,
            yaml_path,
            json.dumps(config)
        ]

        try:
            # 执行命令
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
                timeout=300  # 5分钟超时
            )

            # 解析输出
            output = json.loads(result.stdout)
            return {
                'status': 'success',
                'data': output
            }

        except subprocess.CalledProcessError as e:
            # 执行失败
            try:
                error_data = json.loads(e.stderr)
            except:
                error_data = {'message': e.stderr}

            return {
                'status': 'error',
                'error': error_data
            }

        except subprocess.TimeoutExpired:
            return {
                'status': 'error',
                'error': {'message': '执行超时'}
            }

        except Exception as e:
            return {
                'status': 'error',
                'error': {'message': str(e)}
            }
```

**Node.js 执行脚本**:

```javascript
// src/midscene_bridge/execute.js
const { PlaywrightAgent } = require('@midscene/web/playwright');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function executeYaml(yamlPath, config) {
  let browser = null;

  try {
    // 启动浏览器
    browser = await chromium.launch({
      headless: config.headless || false,
      args: ['--no-sandbox']
    });

    const context = await browser.newContext({
      viewport: {
        width: config.viewport?.width || 1920,
        height: config.viewport?.height || 1080
      }
    });

    const page = await context.newPage();

    // 创建 Midscene Agent
    const agent = await PlaywrightAgent.create(page, {
      generateReport: true,
      groupName: config.groupName || '自动化测试执行',
      autoPrintReportMsg: false,
      cache: {
        enabled: config.cache || false
      }
    });

    // 读取 YAML
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

    // 执行 YAML
    const result = await agent.runYaml(yamlContent);

    // 获取报告路径
    const reportPath = agent.reportHTMLPath();

    // 返回结果 (通过 stdout)
    console.log(JSON.stringify({
      status: 'success',
      result: result,
      report_path: reportPath,
      duration: agent.dump.totalDuration || 0,
      tasks_count: agent.dump.tasks?.length || 0
    }));

  } catch (error) {
    // 返回错误 (通过 stderr)
    console.error(JSON.stringify({
      status: 'error',
      message: error.message,
      stack: error.stack
    }));
    process.exit(1);

  } finally {
    // 清理资源
    if (browser) {
      await browser.close();
    }
  }
}

// 解析命令行参数
const args = process.argv.slice(2);
const yamlPath = args[0];
const config = JSON.parse(args[1] || '{}');

// 执行
executeYaml(yamlPath, config);
```

### 6.3 PRD 处理实现

```python
# src/business/prd_processor.py
import os
import json
import requests
from typing import Dict, Optional

class PRDProcessor:
    def __init__(self, api_key: str, model: str = "deepseek-chat"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.deepseek.com/v1"

    def parse_prd(self, prd_content: str) -> Dict:
        """解析 PRD 文档"""
        return {
            'content': prd_content,
            'length': len(prd_content),
            'has_url': 'http' in prd_content.lower()
        }

    def generate_yaml(
        self,
        prd_content: str,
        additional_context: Optional[str] = None
    ) -> str:
        """调用 LLM 生成 YAML 测试用例"""

        # 读取 Prompt 模板
        prompt_template = self._load_prompt_template()

        # 构建 Prompt
        prompt = prompt_template.format(
            prd_content=prd_content,
            additional_context=additional_context or ""
        )

        # 调用 LLM API
        response = self._call_llm_api(prompt)

        # 提取 YAML
        yaml_content = self._extract_yaml_from_response(response)

        return yaml_content

    def _load_prompt_template(self) -> str:
        """加载 Prompt 模板"""
        template_path = os.path.join(
            os.path.dirname(__file__),
            '../prompts/prd_to_yaml_prompt.txt'
        )
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()

    def _call_llm_api(self, prompt: str) -> str:
        """调用 DeepSeek API"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': '你是一个专业的测试用例设计专家。'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7,
            'max_tokens': 4096
        }

        response = requests.post(
            f'{self.base_url}/chat/completions',
            headers=headers,
            json=data,
            timeout=60
        )

        response.raise_for_status()
        result = response.json()

        return result['choices'][0]['message']['content']

    def _extract_yaml_from_response(self, response: str) -> str:
        """从 LLM 响应中提取 YAML 内容"""
        # 尝试提取 ```yaml ``` 代码块
        import re

        # 匹配 ```yaml ... ``` 或 ``` ... ```
        patterns = [
            r'```yaml\s*\n(.*?)\n```',
            r'```\s*\n(.*?)\n```'
        ]

        for pattern in patterns:
            match = re.search(pattern, response, re.DOTALL)
            if match:
                return match.group(1).strip()

        # 如果没有代码块,返回整个响应
        return response.strip()
```

### 6.4 数据流详解

```
┌─────────────────────────────────────────────────────┐
│ 用户上传 PRD (Markdown)                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Gradio UI 接收文件/文本                              │
│ - File Upload 组件                                  │
│ - Textbox 组件                                      │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ PRDProcessor.parse_prd()                            │
│ - 提取文本内容                                       │
│ - 基础验证 (长度、格式)                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ PRDProcessor.generate_yaml()                        │
│ - 加载 Prompt 模板                                  │
│ - 构建完整 Prompt                                   │
│ - 调用 DeepSeek-V3 API                              │
│ - 解析响应,提取 YAML                                │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ TestCaseManager.validate_yaml()                     │
│ - 解析 YAML 格式                                    │
│ - 检查必填字段                                       │
│ - 验证指令语法                                       │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Gradio UI 展示生成的 YAML                            │
│ - 语法高亮展示                                       │
│ - 提供 [下载] 按钮                                   │
│ - 提供 [直接执行] 按钮                               │
└─────────────────────────────────────────────────────┘
                    ↓ (用户点击执行)
┌─────────────────────────────────────────────────────┐
│ TestCaseManager.execute_yaml()                      │
│ - 保存 YAML 到临时文件                              │
│ - 准备配置参数                                       │
│ - subprocess 调用 Node.js                           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Node.js execute.js                                  │
│ - 启动 Playwright 浏览器                            │
│ - 创建 Midscene Agent                               │
│ - 执行 agent.runYaml(yamlContent)                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Midscene YAML Player                                │
│ - 解析 YAML 脚本                                    │
│ - 逐步执行指令                                       │
│   - aiAction → AI 规划 → 执行操作                   │
│   - aiTap → 定位元素 → 点击                         │
│   - aiInput → 定位输入框 → 输入文本                  │
│   - aiAssert → AI 验证页面状态                      │
│   - aiQuery → AI 提取数据                           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Playwright 驱动浏览器                                │
│ - 打开页面                                          │
│ - 执行操作 (点击、输入、滚动)                        │
│ - 截图                                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Midscene 生成报告                                    │
│ - 收集执行记录                                       │
│ - 生成 HTML 报告                                    │
│ - 保存到 reports/ 目录                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Node.js 返回结果 (JSON via stdout)                   │
│ {                                                   │
│   "status": "success",                              │
│   "result": {...},                                  │
│   "report_path": "/path/to/report.html",           │
│   "duration": 45.3                                  │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Python 解析结果                                      │
│ - 提取报告路径                                       │
│ - 提取执行时长                                       │
│ - 提取错误信息 (如果有)                              │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Gradio UI 展示结果                                   │
│ ✅ 测试通过 - 耗时 45.3s                            │
│ [查看详细报告] (打开 HTML 文件)                      │
└─────────────────────────────────────────────────────┘
```

---

## 七、UI 界面设计

### 7.1 主题和品牌规范

**品牌元素**:
- **主题色**: #005BF5 (蓝色)
- **Logo**: 数字浙江 Logo (左上角)
- **版权信息**: Copyright © 孙顺达 (右上角)
- **语言**: 完全中文化

**UI 风格**:
- 简洁现代
- 卡片式布局
- 清晰的操作流程
- 友好的错误提示

### 7.2 Tab 页面详细设计

#### **Tab 1: LLM 配置**

```
┌────────────────────────────────────────────────────┐
│ 🤖 LLM 配置                                        │
├────────────────────────────────────────────────────┤
│                                                    │
│ 【主模型配置】                                      │
│ ┌────────────────────────────────────────────────┐│
│ │ 提供商: [SiliconFlow ▼]                        ││
│ │ API Key: [••••••••••••••]  [显示]             ││
│ │ 模型名称: [Qwen/Qwen2.5-VL ▼]                  ││
│ │ Base URL: [https://api.siliconflow.cn/v1]     ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ 【规划器配置】                                      │
│ ┌────────────────────────────────────────────────┐│
│ │ 提供商: [DeepSeek ▼]                           ││
│ │ API Key: [••••••••••••••]  [显示]             ││
│ │ 模型名称: [deepseek-chat ▼]                    ││
│ │ Base URL: [https://api.deepseek.com/v1]       ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ 【高级参数】                                        │
│ ┌────────────────────────────────────────────────┐│
│ │ Temperature: [0.7] (0-1)                       ││
│ │ Max Tokens: [4096]                             ││
│ │ Timeout: [60] 秒                               ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ [保存配置]  [测试连接]  [重置默认]                  │
│                                                    │
│ 💡 提示: 测试连接将发送一个简单请求验证配置是否正确    │
└────────────────────────────────────────────────────┘
```

#### **Tab 2: 浏览器设置**

```
┌────────────────────────────────────────────────────┐
│ 🌐 浏览器设置                                       │
├────────────────────────────────────────────────────┤
│                                                    │
│ 【浏览器引擎】                                      │
│ ○ Playwright (推荐)                                │
│ ○ Puppeteer                                        │
│                                                    │
│ 【显示模式】                                        │
│ ☑ 无头模式 (Headless)                              │
│                                                    │
│ 【窗口设置】                                        │
│ 宽度: [1920] 像素                                  │
│ 高度: [1080] 像素                                  │
│                                                    │
│ 【性能设置】                                        │
│ 操作超时: [30] 秒                                  │
│ 页面加载超时: [60] 秒                              │
│ 截图质量: [高 ▼] (高/中/低)                        │
│                                                    │
│ 【缓存设置】                                        │
│ ☑ 启用 Midscene 缓存 (提升性能)                    │
│                                                    │
│ [保存设置]  [恢复默认]                              │
└────────────────────────────────────────────────────┘
```

#### **Tab 3: 测试用例管理**

```
┌────────────────────────────────────────────────────┐
│ 📝 测试用例管理                                     │
├────────────────────────────────────────────────────┤
│                                                    │
│ 【步骤 1: 获取测试用例】                            │
│ [下载 YAML 模板] [查看示例]                         │
│                                                    │
│ 上传 YAML 文件: [选择文件]                          │
│ 或直接输入:                                         │
│ ┌────────────────────────────────────────────────┐│
│ │ web:                                           ││
│ │   url: https://example.com                     ││
│ │   headless: false                              ││
│ │                                                ││
│ │ tasks:                                         ││
│ │   - name: "用户登录测试"                        ││
│ │     flow:                                      ││
│ │       - aiAction: "点击登录按钮"                ││
│ │       - aiInput:                               ││
│ │           locate: "用户名输入框"                ││
│ │           value: "test@example.com"            ││
│ │       ...                                      ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ [解析用例] [清空内容]                               │
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ 【步骤 2: 查看解析结果】                            │
│ ✅ 解析成功! 共找到 2 个测试用例                    │
│                                                    │
│ ○ 用例 1: 用户登录测试 (7 步)                      │
│ ○ 用例 2: 搜索功能测试 (5 步)                      │
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ 【步骤 3: 执行测试】                                │
│ [执行选中用例] [执行所有用例 (迭代2)]               │
│                                                    │
│ 执行状态: ⏳ 正在执行用例 1...                      │
│ ┌────────────────────────────────────────────────┐│
│ │ [████████████████░░░░] 80% (6/7 步完成)        ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ 【步骤 4: 查看结果】                                │
│ ✅ 测试通过!                                        │
│ 执行时长: 45.3 秒                                  │
│ 任务数: 1                                          │
│ 步骤数: 7                                          │
│                                                    │
│ [查看详细报告] [下载报告] [重新执行]                │
└────────────────────────────────────────────────────┘
```

#### **Tab 4: PRD 生成用例**

```
┌────────────────────────────────────────────────────┐
│ 📄 PRD 生成测试用例                                 │
├────────────────────────────────────────────────────┤
│                                                    │
│ 【步骤 1: 上传 PRD 文档】                           │
│ 支持格式: Markdown (.md), 纯文本 (.txt)            │
│                                                    │
│ 上传文件: [选择文件]                                │
│ 或直接输入:                                         │
│ ┌────────────────────────────────────────────────┐│
│ │ # 用户登录功能 PRD                              ││
│ │                                                ││
│ │ ## 功能描述                                    ││
│ │ 用户可以通过用户名和密码登录系统。               ││
│ │                                                ││
│ │ ## 功能需求                                    ││
│ │ 1. 页面右上角显示"登录"按钮                     ││
│ │ 2. 点击"登录"按钮后,弹出登录表单                ││
│ │ 3. 表单包含:                                   ││
│ │    - 用户名输入框                              ││
│ │    - 密码输入框                                ││
│ │    - "提交"按钮                                ││
│ │ ...                                            ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ [生成测试用例] [清空内容]                           │
│                                                    │
│ ─────────────────────────────────────────────────  │
│                                                    │
│ 【步骤 2: 查看生成结果】                            │
│ ✅ 生成成功! AI 生成了 2 个测试用例                 │
│ 生成耗时: 12.5 秒                                  │
│                                                    │
│ ┌────────────────────────────────────────────────┐│
│ │ web:                                           ││
│ │   url: https://example.com                     ││
│ │   headless: false                              ││
│ │                                                ││
│ │ tasks:                                         ││
│ │   - name: "用户登录功能-正常流程测试"            ││
│ │     flow:                                      ││
│ │       - aiAction: "找到页面右上角的登录按钮..."  ││
│ │       ...                                      ││
│ │   - name: "用户登录功能-错误密码测试"            ││
│ │     flow: ...                                  ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ [编辑 YAML] [下载 YAML] [直接执行] [重新生成]       │
│                                                    │
│ 💡 提示: 您可以编辑生成的 YAML,然后点击"直接执行"   │
└────────────────────────────────────────────────────┘
```

#### **Tab 5: 测试执行** (预留,迭代 2 实现)

```
┌────────────────────────────────────────────────────┐
│ ▶️ 测试执行                                         │
├────────────────────────────────────────────────────┤
│                                                    │
│ 【功能说明】                                        │
│ 本页面用于批量执行和管理测试任务                     │
│ 预计在迭代 2 实现                                   │
│                                                    │
│ 【计划功能】                                        │
│ - 批量选择测试用例                                  │
│ - 并行执行控制                                      │
│ - 实时进度展示                                      │
│ - 批量测试报告                                      │
│                                                    │
│ 💡 当前版本请使用 "测试用例管理" 页面执行单个用例    │
└────────────────────────────────────────────────────┘
```

#### **Tab 6: 操作说明**

```
┌────────────────────────────────────────────────────┐
│ 📖 操作说明                                         │
├────────────────────────────────────────────────────┤
│                                                    │
│ [快速开始] [YAML 编写指南] [PRD 编写建议] [FAQ]     │
│                                                    │
│ ┌────────────────────────────────────────────────┐│
│ │ # 快速开始指南                                  ││
│ │                                                ││
│ │ ## 1. 配置 LLM                                 ││
│ │ 首次使用需要配置 AI 模型:                       ││
│ │ 1. 点击"LLM 配置"标签页                         ││
│ │ 2. 填入 SiliconFlow API Key                    ││
│ │ 3. 填入 DeepSeek API Key                       ││
│ │ 4. 点击"测试连接"验证配置                       ││
│ │ 5. 点击"保存配置"                               ││
│ │                                                ││
│ │ ## 2. 生成测试用例                             ││
│ │ 有两种方式生成测试用例:                         ││
│ │                                                ││
│ │ ### 方式 A: 从 PRD 生成                        ││
│ │ 1. 点击"PRD 生成用例"标签页                     ││
│ │ 2. 上传或粘贴 PRD 文档                          ││
│ │ 3. 点击"生成测试用例"                           ││
│ │ 4. 下载生成的 YAML 或直接执行                   ││
│ │                                                ││
│ │ ### 方式 B: 手工编写 YAML                      ││
│ │ 1. 点击"测试用例管理"标签页                     ││
│ │ 2. 下载 YAML 模板                              ││
│ │ 3. 编辑模板,填入测试步骤                        ││
│ │ 4. 上传或粘贴 YAML                             ││
│ │                                                ││
│ │ ## 3. 执行测试                                 ││
│ │ 1. 在"测试用例管理"页面解析 YAML                ││
│ │ 2. 选择要执行的用例                            ││
│ │ 3. 点击"执行测试"                               ││
│ │ 4. 等待执行完成,查看报告                        ││
│ │                                                ││
│ │ ## 4. 查看报告                                 ││
│ │ 执行完成后,点击"查看详细报告"查看:               ││
│ │ - 执行时间线                                   ││
│ │ - 每步截图                                     ││
│ │ - AI 思考过程                                  ││
│ │ - 执行结果                                     ││
│ │                                                ││
│ │ ---                                            ││
│ │                                                ││
│ │ # YAML 编写指南                                ││
│ │                                                ││
│ │ ## YAML 格式说明                               ││
│ │ ...                                            ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ [下载完整文档 (PDF)]                                │
└────────────────────────────────────────────────────┘
```

### 7.3 错误提示和帮助信息

**友好的错误提示**:

```
❌ 错误: YAML 格式不正确
详细信息: 第 12 行缺少必填字段 'locate'

建议:
1. 检查第 12 行的 aiInput 指令
2. 确保包含 'locate' 字段
3. 参考 YAML 模板中的示例

[查看文档] [下载模板]
```

**加载提示**:

```
⏳ 正在生成测试用例...
这可能需要 10-30 秒,请耐心等待

AI 正在分析您的 PRD:
✓ 已提取功能需求
✓ 已识别操作步骤
⏳ 正在生成 YAML...
```

---

## 八、风险与挑战

### 8.1 技术风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| **Python-Node.js 跨语言调用不稳定** | 高 | 中 | 充分测试、完善错误处理、日志记录 |
| **LLM 生成质量不稳定** | 高 | 高 | 提供用例编辑功能、人工审核、迭代优化 Prompt |
| **Midscene 版本升级兼容性** | 中 | 低 | 锁定版本 (0.30.8)、定期测试 |
| **浏览器驱动问题** | 中 | 中 | 提供 Puppeteer 备选方案、错误重试 |
| **执行超时** | 中 | 中 | 设置合理超时时间、支持用户自定义 |

### 8.2 业务风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| **PRD 格式多样化** | 中 | 高 | 提供 PRD 模板、格式指南、支持自由文本 |
| **生成的用例不符合预期** | 高 | 高 | MVP 阶段收集反馈、迭代优化 Prompt |
| **用户不会编写 YAML** | 中 | 中 | 提供详细文档、示例、模板下载 |
| **测试执行速度慢** | 中 | 中 | 利用 Midscene 缓存、并行执行 (迭代 2) |
| **测试结果不准确** | 高 | 中 | 优化断言设计、提供人工审核机制 |

### 8.3 用户体验风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| **学习成本高** | 中 | 中 | 详细文档、视频教程、在线帮助 |
| **操作流程复杂** | 中 | 低 | 简化流程、清晰的步骤指引 |
| **报告不易理解** | 低 | 低 | 复用 Midscene 成熟报告系统 |

### 8.4 风险应对计划

**高优先级风险应对**:

1. **LLM 生成质量不稳定**
   - **短期**: 在 UI 中添加"重新生成"按钮,支持多次尝试
   - **中期**: 收集用户反馈,优化 Prompt
   - **长期**: 使用 Few-shot Learning,提供示例

2. **生成的用例不符合预期**
   - **短期**: 提供在线编辑功能,用户可以修改生成的 YAML
   - **中期**: 实现用例审查功能,AI 提供优化建议
   - **长期**: 建立用例库,复用高质量用例

3. **Python-Node.js 通信不稳定**
   - **短期**: 完善错误处理,提供详细的错误信息
   - **中期**: 添加重试机制和超时控制
   - **长期**: 考虑使用 gRPC 或 HTTP API 替代 subprocess

---

## 九、成功指标

### 9.1 MVP 阶段指标 (Week 1-2)

**功能完整性**:
- [x] 核心流程可走通 (PRD → YAML → 执行 → 报告)
- [x] 所有 6 个 Tab 页面实现
- [x] 基础配置功能可用

**可用性**:
- [ ] 至少 3 个内部用户试用
- [ ] 收集至少 10 条反馈意见
- [ ] 修复所有阻塞性 Bug

**质量**:
- [ ] 单元测试覆盖率 > 60%
- [ ] 无严重崩溃和数据丢失
- [ ] 错误提示清晰友好

### 9.2 迭代 2 阶段指标 (Week 3-5)

**效率提升**:
- [ ] PRD 生成 YAML 准确率 > 70%
- [ ] 用例执行成功率 > 85%
- [ ] 相比手工编写效率提升 > 50%

**功能丰富性**:
- [ ] 批量测试功能可用
- [ ] 测试报告完整度 > 90%
- [ ] 支持历史记录查询

**用户满意度**:
- [ ] 用户试用数 > 10
- [ ] 用户留存率 > 60%
- [ ] NPS (Net Promoter Score) > 20

### 9.3 迭代 3 阶段指标 (Week 6-9)

**智能化水平**:
- [ ] 智能页面遍历功能可用
- [ ] 页面覆盖率 > 80%
- [ ] 自动生成的功能清单准确率 > 75%

**测试质量**:
- [ ] 测试用例质量评分 > 8/10
- [ ] 测试覆盖率 > 70%
- [ ] 回归测试通过率 > 90%

**业务价值**:
- [ ] 测试成本降低 > 40%
- [ ] 测试周期缩短 > 50%
- [ ] 发现 Bug 数量提升 > 30%

---

## 十、总结

### 10.1 项目亮点

**1. 技术选型合理**
- ✅ 复用 Midscene.js 成熟框架,减少 40-50% 开发工作量
- ✅ 基于 YAML 标准,易于编写和维护
- ✅ 跨语言集成方案清晰,技术风险可控

**2. 产品定位清晰**
- ✅ 完整闭环: PRD → 测试用例 → 执行 → 报告
- ✅ 降低测试门槛,无需编写代码
- ✅ AI 驱动,提升效率

**3. 架构设计灵活**
- ✅ 模块化设计,易于扩展
- ✅ 业务层与技术层解耦
- ✅ 支持多平台 (Web/Android/iOS)

**4. 迭代路径明确**
- ✅ MVP 专注核心功能,可快速验证
- ✅ 迭代 2-4 逐步增强能力
- ✅ 最终实现智能探索和测试

### 10.2 核心价值

**对测试人员**:
- 📝 从 PRD 自动生成测试用例,节省 70% 编写时间
- 🤖 使用自然语言描述,无需学习编程
- 📊 自动生成可视化报告,结果一目了然

**对团队**:
- 🚀 提升测试效率 50%+
- 💰 降低测试成本 40%+
- 🎯 提高测试覆盖率

**对项目**:
- ✅ 快速验证产品功能
- 🐛 提早发现 Bug
- 📈 持续回归测试

### 10.3 未来展望

**短期 (3个月)**:
- 完成 MVP 和迭代 2
- 在 3-5 个项目中试用
- 收集反馈,优化产品

**中期 (6个月)**:
- 实现智能页面遍历
- 支持团队协作
- 接入 CI/CD 流程

**长期 (1年)**:
- 建立测试用例库
- AI 自动修复测试用例
- 支持移动端自动化

### 10.4 下一步行动

**立即执行**:
1. ✅ 评审 PRD,确认需求
2. ✅ 搭建开发环境
3. ✅ 创建项目仓库
4. ✅ 启动 MVP 开发

**第一周**:
1. 搭建 Gradio UI 框架
2. 实现 Midscene 桥接层
3. 完成 LLM 配置功能

**第二周**:
1. 实现测试用例管理
2. 实现 PRD 生成用例
3. 集成测试和优化

---

## 附录

### 附录 A: 术语表

| 术语 | 说明 |
|------|------|
| **PRD** | Product Requirements Document,产品需求文档 |
| **YAML** | YAML Ain't Markup Language,一种数据序列化格式 |
| **LLM** | Large Language Model,大型语言模型 |
| **VLM** | Vision Language Model,视觉语言模型 |
| **Agent** | Midscene 中的智能代理,负责执行自动化任务 |
| **Playwright** | 微软开源的浏览器自动化工具 |
| **Puppeteer** | Google 开源的浏览器自动化工具 |
| **Gradio** | Python Web 框架,用于快速构建 ML 应用界面 |

### 附录 B: 参考资源

- **Midscene.js 官网**: https://midscenejs.com
- **Midscene.js GitHub**: https://github.com/web-infra-dev/midscene
- **Playwright 官网**: https://playwright.dev
- **Gradio 官网**: https://gradio.app
- **DeepSeek API 文档**: https://api-docs.deepseek.com
- **SiliconFlow API 文档**: https://docs.siliconflow.cn

### 附录 C: 联系方式

**项目负责人**: 孙顺达
**项目邮箱**: [待补充]
**问题反馈**: [待补充]

---

**文档结束**

© 2025 孙顺达 版权所有
