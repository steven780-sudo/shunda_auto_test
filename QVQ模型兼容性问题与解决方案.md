# QVQ-72B-Preview 模型兼容性问题与解决方案

## 🔴 问题描述

使用 QVQ-72B-Preview 模型时，执行复杂的 `aiAction()` 指令会报错：

```
Error: failed to parse json response: Alright, I've got this task to accomplish...
```

**错误位置**: `llm-planning.ts:135` - JSON 解析失败

## 🔍 根本原因

### QVQ-72B-Preview 的特性

QVQ-72B-Preview 是 Qwen 的**推理模型**，设计特点：

1. **输出思维链（CoT）**: 模型会输出完整的推理过程
2. **文本格式**: 返回自然语言解释，而不是结构化 JSON
3. **专注视觉推理**: 擅长理解图像和推理，但不擅长生成结构化输出

### Midscene 的要求

Midscene 的 `aiAction()` 需要：

```json
{
  "tasks": [
    {"type": "Tap", "locate": "xxx"},
    {"type": "Input", "locate": "xxx", "value": "xxx"}
  ]
}
```

但 QVQ 返回的是：

```
Alright, I've got this task to accomplish. Let me break it down step by step...
```

## 💡 解决方案

### ✅ 方案 A: 使用离散 API（强烈推荐）

**不要使用 `aiAction()`，而是使用离散的 API 调用：**

```typescript
// ❌ 错误：使用 aiAction（QVQ 不支持）
await agent.aiAction('在百度搜索数字浙江，点击百度一下，然后点击百度百科链接');

// ✅ 正确：使用离散 API（QVQ 完美支持）
await agent.aiInput({ locate: '搜索框', value: '数字浙江' });
await agent.aiTap('百度一下');
await agent.aiTap('百度百科链接');
```

**为什么这样可以工作？**

- `aiInput()`, `aiTap()`, `aiScroll()` 等不需要复杂的 JSON 规划
- 这些 API 直接使用视觉模型的核心能力：**元素定位**和**视觉理解**
- QVQ-72B-Preview 在这些任务上表现出色

### ✅ 方案 B: 使用 Playground 手动测试（推荐）

在 Playground (http://localhost:3000) 中，**分步输入简单指令**：

#### 步骤 1: 输入搜索词
```
在搜索框输入"数字浙江"
```

#### 步骤 2: 点击搜索
```
点击"百度一下"按钮
```

#### 步骤 3: 打开百科
```
点击搜索结果中的"数字浙江 百度百科"链接
```

#### 步骤 4: 查找信用代码
```
向下滚动，直到看到"统一社会信用代码"
```

#### 步骤 5: 提取数据
```
提取"统一社会信用代码"的值，返回 JSON: {"creditCode": "xxx"}
```

**关键**: 每次只执行**一个简单操作**，不要一次性提出复杂任务

### ⚠️ 方案 C: 切换到其他模型

如果需要使用 `aiAction()` 的自动规划功能：

#### 选项 1: Qwen2-VL (原版)

```bash
# .env
MIDSCENE_OPENAI_API_KEY=sk-ubersdpfboocpgtetjkqwkvlwugesaybqrgbyhfytlnyhyge
MIDSCENE_OPENAI_BASE_URL=https://api.siliconflow.cn/v1
MIDSCENE_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct

# 同步更新所有子任务
MIDSCENE_PLANNING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
MIDSCENE_VQA_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
MIDSCENE_GROUNDING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
```

**优点**:
- ✅ 支持 JSON 结构化输出
- ✅ 支持 `aiAction()` 自动规划
- ✅ 价格便宜

**缺点**:
- ⚠️ 推理能力不如 QVQ-72B-Preview
- ⚠️ 可能在复杂场景下表现不佳

#### 选项 2: GPT-4V

```bash
# .env
MIDSCENE_OPENAI_API_KEY=your-openai-key
MIDSCENE_OPENAI_BASE_URL=https://api.openai.com/v1
MIDSCENE_MODEL_NAME=gpt-4o-2024-08-06

MIDSCENE_PLANNING_MODEL_NAME=gpt-4o-2024-08-06
MIDSCENE_VQA_MODEL_NAME=gpt-4o-2024-08-06
MIDSCENE_GROUNDING_MODEL_NAME=gpt-4o-2024-08-06
```

**优点**:
- ✅ 完全兼容
- ✅ 强大的规划能力
- ✅ 稳定的 JSON 输出

**缺点**:
- ❌ 成本更高
- ❌ 需要官方 API Key

#### 选项 3: Claude Sonnet 4 (如果代理支持)

参考之前的 `Anthropic配置问题和解决方案.md`

---

## 📝 实战示例

### 当前测试任务：数字浙江信用代码查询

#### ❌ 错误方式（导致 JSON 解析错误）

```typescript
// 在 Playground 中输入：
帮我完成以下任务：在百度搜索数字浙江，点击百度一下，点击百度百科链接，滚动查找统一社会信用代码，提取代码值

// 结果：QVQ 返回文本推理，Midscene 无法解析
```

#### ✅ 正确方式 1：Playground 分步执行

**指令 1**:
```
在搜索框输入"数字浙江"
```
等待完成 ✅

**指令 2**:
```
点击"百度一下"按钮
```
等待完成 ✅

**指令 3**:
```
点击搜索结果中包含"百度百科"的链接
```
等待完成 ✅

**指令 4**:
```
向下滚动500像素
```
重复 2-3 次，直到看到"统一社会信用代码" ✅

**指令 5**:
```
提取页面中"统一社会信用代码"的值，返回 JSON: {"creditCode": "代码"}
```

#### ✅ 正确方式 2：TypeScript 代码

```typescript
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import puppeteer from 'puppeteer';

async function testDigitalZhejiang() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const agent = new PuppeteerAgent(page);

  await page.goto('https://www.baidu.com');

  // 步骤 1: 输入搜索词
  await agent.aiInput({
    locate: '搜索输入框',
    value: '数字浙江'
  });

  // 步骤 2: 点击搜索
  await agent.aiTap('百度一下');

  // 步骤 3: 等待并点击百科链接
  await page.waitForTimeout(2000);
  await agent.aiTap('数字浙江 百度百科');

  // 步骤 4: 滚动查找
  await page.waitForTimeout(2000);
  let found = false;
  let scrollAttempts = 0;

  while (!found && scrollAttempts < 5) {
    const isVisible = await agent.aiQuery<boolean>(
      '判断当前页面是否显示了"统一社会信用代码"，返回 true 或 false'
    );

    if (isVisible) {
      found = true;
      break;
    }

    await page.evaluate(() => window.scrollBy(0, 500));
    scrollAttempts++;
    await page.waitForTimeout(1500);
  }

  // 步骤 5: 提取数据
  if (found) {
    const result = await agent.aiQuery<{ creditCode: string }>(
      '提取"统一社会信用代码"的值，返回 JSON: {"creditCode": "代码"}'
    );
    console.log('结果:', result);
  } else {
    console.log('未找到统一社会信用代码');
  }

  await browser.close();
}

testDigitalZhejiang();
```

---

## 🎯 模型能力对比

### QVQ-72B-Preview vs 其他模型

| 功能 | QVQ-72B-Preview | Qwen2-VL-72B | GPT-4o | Claude Sonnet 4.5 |
|------|----------------|--------------|---------|-------------------|
| **视觉理解** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **推理能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **JSON 输出** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **支持 aiAction** | ❌ | ✅ | ✅ | ✅ |
| **支持离散 API** | ✅ | ✅ | ✅ | ✅ |
| **成本** | 💰 低 | 💰 低 | 💰💰💰 高 | 💰💰 中 |

---

## ✅ 推荐配置

### 当前最佳实践：保留 QVQ-72B-Preview + 使用离散 API

**配置** (`.env` 保持不变):
```bash
MIDSCENE_MODEL_NAME=Qwen/QVQ-72B-Preview
```

**使用方式**:
- ✅ 在 Playground 中使用**简单、单一**的指令
- ✅ 在代码中使用 `aiTap()`, `aiInput()`, `aiScroll()`, `aiQuery()`
- ❌ 避免使用复杂的 `aiAction()` 或长指令

### 备选方案：混合配置

为规划任务使用其他模型，为视觉任务使用 QVQ：

```bash
# 规划任务使用 Qwen2-VL（支持 JSON）
MIDSCENE_PLANNING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct

# 视觉任务使用 QVQ（推理能力强）
MIDSCENE_VQA_MODEL_NAME=Qwen/QVQ-72B-Preview
MIDSCENE_GROUNDING_MODEL_NAME=Qwen/QVQ-72B-Preview

# 主模型
MIDSCENE_MODEL_NAME=Qwen/QVQ-72B-Preview
```

这样可以获得：
- ✅ 规划任务的 JSON 兼容性
- ✅ 视觉任务的强推理能力
- ✅ 成本优化

---

## 🚀 立即测试

### 在 Playground 中测试（推荐）

1. 打开 http://localhost:3000
2. 依次输入以下**简单指令**：

```
在搜索框输入"数字浙江"
```

等待完成后：

```
点击"百度一下"
```

等待完成后：

```
点击搜索结果中的"百度百科"链接
```

等待页面加载后：

```
向下滚动500像素
```

重复滚动 2-3 次，然后：

```
提取"统一社会信用代码"的值
```

### 预期结果

每个简单指令都应该成功执行，不会出现 JSON 解析错误。

---

## 📚 总结

1. **问题**: QVQ-72B-Preview 不支持复杂的 `aiAction()` 规划任务
2. **原因**: 模型输出推理文本，而不是结构化 JSON
3. **解决**: 使用离散 API (`aiTap`, `aiInput`, 等) 或切换模型
4. **推荐**: 保留 QVQ + 分步执行简单指令（最佳性价比）

QVQ-72B-Preview 依然是优秀的视觉模型，只需要调整使用方式即可充分发挥其能力！🎉
