# AUTO_TEST 项目文档索引

> **项目版本**: 0.30.8
> **文档版本**: v1.0
> **最后更新**: 2025-11-16
> **维护者**: 孙顺达

---

## 📚 文档目录

本文档体系为产品经理和开发人员提供完整的项目说明,包括代码结构、配置项、操作指南和 SDK 使用方法。

### 核心文档

1. **[项目配置指南](./01_项目配置指南.md)** - 环境配置、可配置项详解、二次开发配置
2. **[项目操作指南](./02_项目操作指南.md)** - 快速开始、Web/Android/iOS 自动化、YAML 脚本、调试技巧
3. **[SDK 使用文档](./03_SDK使用文档.md)** - Agent API、设备接口、AI 模型集成、扩展开发
4. **[多平台测试指南](./04_多平台测试指南.md)** - Web/Android/iOS 测试、跨平台策略、CI/CD 集成

### 已有文档 (父目录)

- **[CODE_DOCUMENTATION.md](../CODE_DOCUMENTATION.md)** - 代码详细说明
- **[PRD.md](../PRD.md)** - 产品需求文档
- **[技术架构设计.md](../技术架构设计.md)** - 技术架构
- **[产品架构分析报告.md](../产品架构分析报告.md)** - 产品架构
- **[MVP_实施计划.md](../MVP_实施计划.md)** - MVP 实施计划
- **[模型选择指南.md](../模型选择指南.md)** - AI 模型选择
- **[Anthropic配置问题和解决方案.md](../Anthropic配置问题和解决方案.md)** - Anthropic 配置
- **[Midscene故障排查完全指南.md](../Midscene故障排查完全指南.md)** - 故障排查
- **[Playground手动测试指南.md](../Playground手动测试指南.md)** - Playground 测试

---

## 🚀 快速开始

### 1. 环境配置

```bash
# 克隆项目
git clone <repository-url>
cd auto_test

# 安装依赖
corepack enable
pnpm install

# 构建项目
pnpm run build

# 配置 AI 模型
cp .env.example .env
# 编辑 .env 文件,填入您的 API Key
```

### 2. 配置 API Key

在 `.env` 文件中配置:

```bash
# 主模型 (视觉理解)
SILICONFLOW_API_KEY=sk-your-key-here
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL

# 规划器模型 (任务规划)
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_MODEL=deepseek-chat
```

### 3. 运行示例

```bash
# Web 自动化示例
cd packages/web-integration
pnpm run demo

# CLI 测试
npx midscene run tests/fixtures/example.yaml
```

---

## 📖 文档概览

### 01. 项目配置指南

**适用人员:** 产品经理、开发人员、测试人员

**内容概要:**
- 环境配置 (Node.js, pnpm, Playwright)
- AI 模型配置 (SiliconFlow, DeepSeek, OpenAI, Anthropic, Gemini)
- 浏览器配置 (Playwright/Puppeteer)
- 缓存配置 (策略、目录)
- 报告配置 (输出目录、格式)
- 日志配置 (调试级别)
- 二次开发配置 (自定义模型、动作、Prompt)

**核心内容:**
- 必需配置项 vs 可选配置项
- 开发环境 vs 生产环境配置
- 配置文件位置和格式
- 常见配置问题解决方案

---

### 02. 项目操作指南

**适用人员:** 测试人员、开发人员

**内容概要:**
- 快速开始 (3 步启动)
- Web 自动化 (Playwright/Puppeteer)
- Android 自动化 (ADB 连接、设备操作)
- iOS 自动化 (WebDriverAgent 配置)
- YAML 脚本使用 (指令说明、完整示例)
- 命令行工具 (CLI 使用)
- Playground 使用 (Web/Android/iOS)
- 调试技巧 (日志、Playground、冻结上下文)
- 常见问题 (Q&A)

**核心内容:**
- 3 大平台的具体操作步骤
- 10+ 常用 YAML 指令
- 实战示例代码
- 元素描述、断言、数据提取最佳实践

---

### 03. SDK 使用文档

**适用人员:** 开发人员

**内容概要:**
- SDK 概述 (核心包介绍)
- Agent API (15+ 方法详解)
  - 交互操作 API (aiAction, aiTap, aiInput, aiScroll)
  - 数据提取 API (aiQuery, aiBoolean, aiExtract)
  - 工具 API (aiAssert, aiLocate, aiWaitFor, runYaml)
- 设备接口 (AbstractInterface 实现)
- AI 模型集成 (ModelConfigManager, 调用 API)
- 缓存机制 (TaskCache 使用)
- 报告生成 (自动/手动生成)
- 扩展开发 (自定义 Prompt、动作、Insight)

**核心内容:**
- 完整的 API 参考
- TypeScript 类型定义
- 实际代码示例
- 扩展开发指南

---

### 04. 多平台测试指南

**适用人员:** 测试人员、DevOps 工程师

**内容概要:**
- Web 平台测试 (Playwright/Puppeteer 配置和示例)
- Android 平台测试 (环境准备、设备操作)
- iOS 平台测试 (WebDriverAgent 配置、设备操作)
- 跨平台测试策略 (统一测试用例、平台特定测试)
- CI/CD 集成 (GitHub Actions、GitLab CI 配置)
- 测试最佳实践 (测试组织、数据驱动、Page Object)

**核心内容:**
- 完整的 E2E 测试示例
- 3 大平台的测试配置
- CI/CD 配置模板
- 测试组织和模式

---

## 🎯 文档使用指南

### 针对不同角色

**产品经理:**
1. 先阅读 [PRD.md](../PRD.md) 了解产品需求
2. 阅读 [产品架构分析报告.md](../产品架构分析报告.md) 了解产品架构
3. 阅读 [项目配置指南](./01_项目配置指南.md) 了解可配置项
4. 阅读 [项目操作指南](./02_项目操作指南.md) 了解如何使用

**测试人员:**
1. 先阅读 [项目配置指南](./01_项目配置指南.md) 配置环境
2. 阅读 [项目操作指南](./02_项目操作指南.md) 学习基本操作
3. 阅读 [多平台测试指南](./04_多平台测试指南.md) 学习测试方法
4. 参考 [YAML_测试用例模板.yaml](../YAML_测试用例模板.yaml) 编写测试用例

**开发人员:**
1. 先阅读 [技术架构设计.md](../技术架构设计.md) 了解技术架构
2. 阅读 [CODE_DOCUMENTATION.md](../CODE_DOCUMENTATION.md) 了解代码结构
3. 阅读 [SDK 使用文档](./03_SDK使用文档.md) 学习 SDK 使用
4. 阅读 [项目配置指南](./01_项目配置指南.md) 了解二次开发配置
5. 参考 [多平台测试指南](./04_多平台测试指南.md) 进行自动化测试

---

## 🔧 项目结构概览

```
auto_test/
├── packages/                    # 核心包目录
│   ├── core/                    # 核心 SDK (Agent, Insight, Executor)
│   ├── web-integration/         # Web 自动化 (Playwright/Puppeteer)
│   ├── android/                 # Android 自动化
│   ├── ios/                     # iOS 自动化
│   ├── cli/                     # 命令行工具
│   ├── playground/              # Playground 服务器
│   ├── visualizer/              # 可视化 UI
│   ├── mcp/                     # Model Context Protocol 服务器
│   └── shared/                  # 共享工具
├── apps/                        # 应用程序目录
│   ├── chrome-extension/        # Chrome 扩展
│   ├── site/                    # 文档网站
│   └── playground/              # Playground 应用
├── shunda_docs/                 # 项目文档
│   ├── 项目文档/                # 本文档体系
│   ├── PRD.md                   # 产品需求文档
│   ├── CODE_DOCUMENTATION.md    # 代码详细说明
│   ├── 技术架构设计.md          # 技术架构
│   └── ...                      # 其他文档
├── .env                         # 环境变量配置
├── package.json                 # 根配置文件
├── pnpm-workspace.yaml          # pnpm 工作区配置
└── nx.json                      # Nx 构建配置
```

---

## 📝 可配置项速查

### 环境变量 (.env)

| 配置项 | 说明 | 必需 | 示例值 |
|--------|------|------|--------|
| `SILICONFLOW_API_KEY` | 主模型 API Key | ✅ | `sk-xxx` |
| `SILICONFLOW_MODEL` | 主模型名称 | ✅ | `Qwen/Qwen2.5-VL` |
| `DEEPSEEK_API_KEY` | 规划器 API Key | ✅ | `sk-xxx` |
| `DEEPSEEK_MODEL` | 规划器模型名称 | ✅ | `deepseek-chat` |
| `HEADLESS` | 无头模式 | ❌ | `false` |
| `VIEWPORT_WIDTH` | 浏览器宽度 | ❌ | `1920` |
| `VIEWPORT_HEIGHT` | 浏览器高度 | ❌ | `1080` |
| `MIDSCENE_CACHE` | 启用缓存 | ❌ | `true` |
| `MIDSCENE_OUTPUT_DIR` | 报告输出目录 | ❌ | `./midscene_run` |
| `DEBUG` | 调试日志 | ❌ | `midscene:*` |

### 代码配置

```typescript
// Agent 配置
const agent = await PlaywrightAgent.create(page, {
  generateReport: true,          // 是否生成报告
  groupName: '测试组名',         // 报告组名
  cache: {                       // 缓存配置
    enabled: true,
    id: 'my-cache',
    strategy: 'read-write'
  },
  modelConfig: () => ({          // 模型配置
    provider: 'openai',
    apiKey: 'sk-xxx',
    model: 'gpt-4o'
  })
});
```

---

## 🔗 相关链接

### 官方资源

- **官方网站**: https://midscenejs.com
- **GitHub 仓库**: https://github.com/web-infra-dev/midscene
- **示例项目**: https://github.com/web-infra-dev/midscene-example
- **Discord 社区**: https://discord.gg/2JyBHxszE4

### AI 模型提供商

- **SiliconFlow**: https://siliconflow.cn (推荐 - Qwen2.5-VL)
- **DeepSeek**: https://www.deepseek.com (推荐 - deepseek-chat)
- **OpenAI**: https://platform.openai.com (GPT-4o)
- **Anthropic**: https://www.anthropic.com (Claude)
- **Google AI**: https://ai.google.dev (Gemini)

---

## 📊 文档统计

| 文档 | 字数 | 代码示例 | 更新日期 |
|------|------|----------|----------|
| 项目配置指南 | ~8000 | 30+ | 2025-11-16 |
| 项目操作指南 | ~12000 | 50+ | 2025-11-16 |
| SDK 使用文档 | ~10000 | 40+ | 2025-11-16 |
| 多平台测试指南 | ~9000 | 35+ | 2025-11-16 |
| **总计** | **~39000** | **155+** | - |

---

## 🤝 贡献指南

### 文档更新流程

1. 识别需要更新的文档
2. 在对应的 Markdown 文件中修改
3. 更新文档版本和日期
4. 提交 Pull Request

### 文档编写规范

- 使用清晰的标题层级
- 提供完整的代码示例
- 包含实际的使用场景
- 添加配置说明和参数表
- 提供常见问题解答

---

## 📞 联系方式

如有疑问或建议,请联系:

**维护者**: 孙顺达
**项目**: AUTO_TEST (基于 Midscene.js)
**版本**: 0.30.8

---

## 📄 版权声明

© 2025 孙顺达 版权所有

本项目基于 Midscene.js (MIT License) 二次开发。

---

**文档索引结束**

最后更新: 2025-11-16
