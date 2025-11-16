# 二次开发方案与 MVP 实施计划

> **文档版本**: v1.0
> **创建日期**: 2025-11-16
> **作者**: 孙顺达
> **基于文档**: PRD.md, CODE_DOCUMENTATION.md, MVP_实施计划.md

---

## 目录

1. [需求理解与分析](#需求理解与分析)
2. [MVP 核心功能设计](#mvp-核心功能设计)
3. [技术方案设计](#技术方案设计)
4. [MVP 任务分解](#mvp-任务分解)
5. [迭代计划](#迭代计划)
6. [风险与应对](#风险与应对)

---

## 需求理解与分析

### 核心需求（基于 PRD.md）

**产品定位:**
- 基于 Midscene.js 构建 AI 驱动的自动化测试平台
- 从 PRD 到测试用例再到自动化执行的完整闭环

**目标用户:**
- 测试工程师 - 快速生成和执行测试用例
- 产品经理 - 从 PRD 快速验证功能
- 开发工程师 - 自测功能
- QA 团队 - 批量回归测试

**两阶段工作模式:**
1. **智能探索阶段** (迭代3) - AI 自动遍历页面生成功能清单
2. **智能测试阶段** (MVP) - PRD → YAML 测试用例 → 执行测试 → 报告

---

## MVP 核心功能设计

基于当前已有基础 (Midscene.js 0.30.8),MVP 版本应聚焦以下核心功能:

### 1. Gradio WebUI 界面

**6 个核心 Tab 页:**

#### Tab 1: LLM 配置
- **功能**: 配置 AI 模型的 API Key 和参数
- **已有基础**: Midscene.js 已支持多种 VLM
- **实现方式**:
  - 主模型配置 (视觉理解): SiliconFlow (Qwen2.5-VL)
  - 规划器配置 (任务规划): DeepSeek (deepseek-chat)
  - 保存到 .env 文件
  - API 连接测试功能

#### Tab 2: 浏览器设置
- **功能**: 配置浏览器引擎和执行参数
- **已有基础**: Midscene.js 支持 Playwright 和 Puppeteer
- **实现方式**:
  - 浏览器引擎选择 (Playwright/Puppeteer)
  - 显示模式 (headless/非headless)
  - 窗口尺寸设置
  - 操作超时配置

#### Tab 3: 测试用例管理
- **功能**: 上传、编辑、解析和执行 YAML 测试用例
- **已有基础**: Midscene.js 已有完整的 YAML 脚本支持
- **实现方式**:
  - 文件上传和在线编辑
  - YAML 解析和验证
  - 用例列表展示
  - 单个/批量执行
  - 查看执行报告

#### Tab 4: PRD 生成用例
- **功能**: 上传 PRD 文档, AI 自动生成 YAML 测试用例
- **核心价值**: 最大的创新点,降低测试门槛
- **实现方式**:
  - PRD 文件上传 (Markdown/Text)
  - 调用 DeepSeek API 生成 YAML
  - 预览和编辑生成的用例
  - 下载或直接执行

#### Tab 5: 测试执行
- **功能**: 执行测试并实时展示进度
- **已有基础**: Midscene.js 的 Agent 和 Executor
- **实现方式**:
  - 测试执行引擎
  - 实时进度展示
  - 截图和日志输出
  - 报告生成

#### Tab 6: 操作说明
- **功能**: 用户手册和常见问题
- **实现方式**:
  - Markdown 文档渲染
  - 示例和截图
  - 视频教程 (可选)

---

### 2. Python ↔ Node.js 桥接

**架构:**
```
Python (Gradio UI)
    ↓ (subprocess)
Node.js (Midscene.js)
    ↓
Playwright/Puppeteer → 浏览器
```

**实现要点:**
- Python 通过 subprocess 调用 Node.js 脚本
- 使用 JSON 传递参数和结果
- 错误处理和超时控制
- 日志输出和进度报告

---

### 3. PRD → YAML 生成引擎

**Prompt 工程:**

```
系统角色:
你是一个专业的测试用例设计专家,精通 Midscene.js 测试框架。

任务:
根据以下 PRD 文档生成标准的 Midscene YAML 测试用例。

输入: {prd_content}

要求:
1. 为每个核心功能生成 1-2 个测试用例
2. 使用 aiAction, aiTap, aiInput, aiAssert, aiQuery, aiWaitFor 等指令
3. 元素描述要具体 (如 "页面右上角的蓝色登录按钮")
4. 断言要明确可验证
5. 关键操作后加 aiWaitFor

输出格式:
返回完整的 YAML 内容,使用 ```yaml 代码块包裹
```

---

## 技术方案设计

### 1. 技术栈

**前端:**
- Gradio 4.16.0 - Web UI 框架
- Custom CSS - 蓝色主题 (#005BF5)

**后端:**
- Python 3.10+ - 主应用逻辑
- Node.js 20+ - Midscene.js 运行环境

**AI 模型:**
- **主模型** (视觉理解): SiliconFlow (Qwen2.5-VL)
  - 用途: 元素定位、页面理解、数据提取
  - API: https://api.siliconflow.cn/v1
- **规划器** (任务规划): DeepSeek (deepseek-chat)
  - 用途: PRD 分析、YAML 生成、复杂任务规划
  - API: https://api.deepseek.com/v1

**测试框架:**
- Midscene.js 0.30.8 (核心)
- Playwright 1.44.1 (浏览器控制)

---

### 2. 项目结构

```
midscene-auto-test/
├── src/
│   ├── ui/                      # Gradio UI
│   │   ├── app.py              # 主应用
│   │   └── tabs/               # 各个 Tab 页面
│   │       ├── llm_config_tab.py
│   │       ├── browser_settings_tab.py
│   │       ├── testcase_management_tab.py
│   │       ├── prd_to_testcase_tab.py
│   │       ├── test_execution_tab.py
│   │       └── user_guide_tab.py
│   ├── business/                # 业务逻辑
│   │   ├── prd_processor.py    # PRD 处理
│   │   ├── testcase_manager.py # 用例管理
│   │   └── report_generator.py # 报告生成
│   ├── midscene_bridge/         # Node.js 桥接
│   │   ├── execute.js          # 执行脚本
│   │   └── config.js           # 配置管理
│   ├── utils/                   # 工具函数
│   │   ├── config_loader.py
│   │   ├── logger.py
│   │   └── validators.py
│   └── prompts/                 # Prompt 模板
│       └── prd_to_yaml_prompt.txt
├── templates/                   # YAML 模板
│   └── testcase_template.yaml
├── docs/                        # 文档
│   └── user_guide.md
├── tests/                       # 测试
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── reports/                     # 测试报告
├── logs/                        # 日志
├── .env                         # 环境变量
├── .env.example                 # 环境变量示例
├── requirements.txt             # Python 依赖
├── package.json                 # Node.js 依赖
└── README.md
```

---

## MVP 任务分解

### 阶段 1: 项目基础搭建 (2 天)

**Day 1:**
- [x] 创建项目目录结构
- [x] 初始化 Git 仓库
- [x] 安装 Python 依赖 (Gradio, pyyaml, requests, python-dotenv)
- [x] 安装 Midscene.js 依赖 (@midscene/web, playwright)
- [x] 配置环境变量 (.env)
- [x] 编写 Node.js 执行脚本
- [x] 测试 Python ↔ Node.js 通信

**Day 2:**
- [ ] 创建 Gradio 主应用 (app.py)
- [ ] 创建 6 个空白 Tab 页面
- [ ] 应用中文化和主题定制
- [ ] 测试 UI 基本功能

**验收标准:**
- Python 可以成功调用 Node.js
- Gradio 应用可以启动
- 6 个 Tab 可以正常显示
- 主题色为 #005BF5

---

### 阶段 2: 核心功能开发 (4 天)

**Day 3: 测试用例管理**
- [ ] 实现 TestCaseManager 类
  - [ ] parse_yaml() - 解析 YAML
  - [ ] validate_yaml() - 验证 YAML
  - [ ] extract_tasks() - 提取任务列表
  - [ ] execute_yaml() - 执行 YAML
- [ ] 实现测试用例管理 Tab UI
  - [ ] 文件上传
  - [ ] 在线编辑
  - [ ] 解析和验证
  - [ ] 执行测试
- [ ] 创建 YAML 模板文件
- [ ] 测试完整流程

**Day 4: PRD 生成用例**
- [ ] 实现 PRDProcessor 类
  - [ ] parse_prd() - 解析 PRD
  - [ ] generate_yaml() - 调用 LLM 生成 YAML
  - [ ] validate_generated_yaml() - 验证生成的 YAML
- [ ] 创建 Prompt 模板
- [ ] 实现 PRD 生成用例 Tab UI
  - [ ] PRD 文件上传
  - [ ] 生成 YAML
  - [ ] 预览和编辑
  - [ ] 下载或执行
- [ ] 测试生成质量

**Day 5: LLM 和浏览器配置**
- [ ] 实现 LLM 配置 Tab
  - [ ] 主模型配置 (SiliconFlow)
  - [ ] 规划器配置 (DeepSeek)
  - [ ] 保存到 .env
  - [ ] 测试连接
- [ ] 实现浏览器设置 Tab
  - [ ] 引擎选择
  - [ ] 显示模式
  - [ ] 窗口设置
  - [ ] 超时配置

**Day 6: 集成测试和报告**
- [ ] 实现 ReportGenerator 类
  - [ ] parse_midscene_report() - 解析 Midscene 报告
  - [ ] generate_summary() - 生成摘要
- [ ] 优化测试执行流程
  - [ ] 进度展示
  - [ ] 错误处理
  - [ ] 日志输出
- [ ] 端到端集成测试
  - [ ] 测试完整流程
  - [ ] 修复 Bug

---

### 阶段 3: 完善与交付 (2 天)

**Day 7: 文档和优化**
- [ ] 编写用户操作手册
  - [ ] 快速开始
  - [ ] 功能说明
  - [ ] YAML 编写指南
  - [ ] PRD 编写建议
  - [ ] 常见问题
- [ ] 实现操作说明 Tab
- [ ] 代码优化和重构
  - [ ] 添加注释
  - [ ] 提取公共函数
  - [ ] 错误处理
- [ ] 准备示例文件
  - [ ] 示例 PRD
  - [ ] 示例 YAML
  - [ ] 界面截图

**Day 8 (可选): 部署和试用**
- [ ] 部署到测试环境
- [ ] 用户试用和反馈收集
- [ ] Bug 修复
- [ ] 文档更新

**验收标准:**
- 所有核心功能可用
- 文档完整易懂
- 至少 3 个用户成功试用

---

## 迭代计划

### MVP 版本 (当前) - 基础功能

**目标:** 实现 PRD → YAML → 执行测试 的基本闭环

**核心功能:**
- ✅ Gradio WebUI (6 个 Tab)
- ✅ LLM 配置
- ✅ 浏览器设置
- ✅ 测试用例管理
- ✅ PRD 生成用例
- ✅ 测试执行和报告

**时间:** 7-8 天

---

### 迭代 1 - 用例优化 (MVP + 2 周)

**目标:** 提升生成用例的质量和稳定性

**新功能:**
1. **用例优化引擎**
   - 分析失败用例
   - AI 自动修复
   - 学习机制

2. **批量测试**
   - 并行执行
   - 测试套件管理
   - 定时任务

3. **测试报告增强**
   - 可视化统计
   - 趋势分析
   - 导出 PDF/Excel

**技术方案:**
- 添加 TaskOptimizer 类
- 使用 celery 实现异步任务
- 集成 ECharts 可视化

---

### 迭代 2 - 多平台支持 (迭代 1 + 2 周)

**目标:** 支持 Android 和 iOS 自动化测试

**新功能:**
1. **Android 测试**
   - ADB 连接管理
   - Android Playground
   - APK 安装和卸载

2. **iOS 测试**
   - WebDriverAgent 集成
   - iOS Playground
   - 应用安装

3. **跨平台用例**
   - 统一 YAML 格式
   - 平台差异处理

**技术方案:**
- 集成 @midscene/android
- 集成 @midscene/ios
- 扩展 YAML 格式支持

---

### 迭代 3 - 智能探索 (迭代 2 + 4 周)

**目标:** 实现 AI 自动遍历页面生成功能清单

**新功能:**
1. **页面探索引擎**
   - 智能遍历页面
   - 生成页面树
   - 提取功能清单

2. **元素识别**
   - 识别可交互元素
   - 生成元素库
   - 自动命名

3. **自动生成测试计划**
   - 根据页面结构生成
   - 覆盖率分析
   - 优先级排序

**技术方案:**
- 实现 PageExplorer 类
- 使用图搜索算法遍历
- AI 辅助识别和分类

---

### 迭代 4 - 协作与集成 (迭代 3 + 2 周)

**目标:** 支持团队协作和 CI/CD 集成

**新功能:**
1. **用户管理**
   - 多用户支持
   - 权限管理
   - 操作日志

2. **用例库**
   - 用例分享
   - 版本管理
   - 评论和评分

3. **CI/CD 集成**
   - GitHub Actions
   - GitLab CI
   - Jenkins 插件

**技术方案:**
- 添加用户认证 (JWT)
- 使用 Git 管理用例
- 提供 CLI 工具

---

## 风险与应对

### 技术风险

**风险 1: AI 生成用例质量不稳定**
- **影响**: 生成的 YAML 可能不符合预期,执行失败率高
- **应对**:
  - 迭代优化 Prompt
  - 添加后处理验证逻辑
  - 提供用例编辑功能
  - 收集反馈不断改进

**风险 2: Python ↔ Node.js 通信稳定性**
- **影响**: 进程通信失败导致测试中断
- **应对**:
  - 完善错误处理
  - 添加超时和重试机制
  - 日志记录方便排查
  - 考虑使用 gRPC (长期)

**风险 3: 浏览器兼容性**
- **影响**: 不同浏览器行为差异导致测试失败
- **应对**:
  - 优先支持 Chromium
  - 提供浏览器选择
  - 记录浏览器版本
  - 提供调试工具

### 产品风险

**风险 4: 用户学习成本**
- **影响**: 用户不会编写 PRD 或 YAML
- **应对**:
  - 提供详细文档和示例
  - 内置模板库
  - 视频教程
  - 在线客服支持

**风险 5: API 成本**
- **影响**: AI API 调用成本高
- **应对**:
  - 实现缓存机制
  - 提供多种模型选择
  - 本地模型支持 (UI-TARS)
  - 按需调用优化

---

## 成功指标

### MVP 阶段指标

**功能指标:**
- ✅ 6 个核心 Tab 全部实现
- ✅ PRD → YAML 生成成功率 >= 80%
- ✅ 测试用例执行成功率 >= 70%
- ✅ 平均生成时间 <= 30秒

**质量指标:**
- ✅ 无崩溃 Bug
- ✅ 关键功能测试覆盖率 >= 80%
- ✅ 文档完整度 >= 90%

**用户指标:**
- ✅ 至少 5 个内部用户试用
- ✅ 用户满意度 >= 4/5
- ✅ 功能完成度反馈 >= 80%

---

## 下一步行动

### 立即执行 (今天)

1. **完成文档体系创建** ✅
   - [x] 项目配置指南
   - [x] 项目操作指南
   - [x] SDK 使用文档
   - [x] 多平台测试指南
   - [x] 二次开发方案

2. **Git 提交文档**
   - [ ] git add shunda_docs/
   - [ ] git commit -m "文档整理版,待二次开发"
   - [ ] git push origin main

3. **开始 MVP 开发**
   - [ ] 创建项目结构
   - [ ] 搭建 Gradio UI
   - [ ] 实现核心功能

### 本周目标

- [ ] 完成 MVP 基础版本
- [ ] 通过内部测试
- [ ] 收集第一批反馈

### 本月目标

- [ ] MVP 稳定版本
- [ ] 至少 10 个用户使用
- [ ] 启动迭代 1 开发

---

**文档结束**

© 2025 孙顺达 版权所有
