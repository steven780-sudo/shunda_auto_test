AI：

```markdown
项目概览

这是一个浏览器自动化测试平台二次开发项目,基于 Browser-Use Web-UI 进行改造,目标是打造一个专业的 AI 驱动的浏览器 UI 测试平台。

核心改造点

1. 界面本地化与品牌定制

所有界面文本完全中文化
蓝色主题 (主题色: #005BF5)
左上角展示"数字浙江"Logo (路径: /Users/sunshunda/Desktop/browser_use/auto_test_by_sunshunda/img/logo.png)
右上角显示"Copyright © 孙顺达"
2. LLM 配置简化

仅保留 SiliconFlow 和 DeepSeek 两个提供商
主 LLM: Qwen/Qwen3-VL-235B-A22B-Thinking
规划器 LLM: deepseek-ai/DeepSeek-V3.2-Exp
隐藏其他提供商 (OpenAI、Anthropic、Google 等)
3. 完整测试流程 (PRD → 测试用例 → 自动化执行)

新增业务交互层实现三大核心功能:

a) 测试用例管理

提供标准测试用例模板下载
支持上传/输入测试用例文档 (Markdown 格式)
用例优化模型自动审查用例质量
提供优化建议,支持多轮修改
b) PRD 生成测试用例

上传 PRD 文档
PRD 审查模型评估完整性
多轮对话补充 PRD
自动生成符合规范的测试用例文档
c) 自动化测试执行

将测试用例转换为自然语言指令
调用 BrowserUseAgent 执行浏览器操作
生成测试报告
4. MCP 性能优化

工具文档本地缓存机制 (减少 90%+ 查询)
智能工具检索 (减少 70%+ Token 消耗)
使用统计优先推荐常用工具
5. 操作说明文档

提供详细的中文操作手册
包含配置指南、使用流程、常见问题
架构设计

采用五层架构,在原有 browser-use 基础上新增业务交互层:

┌─────────────────────────────────────────────┐
│ 1. WebUI 展示层 (Gradio)                    │
│    6个标签页: LLM配置 | 浏览器设置 |        │
│    测试用例管理 | PRD生成用例 | 测试执行 |  │
│    操作说明                                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. 业务交互层 ⭐ (新增)                     │
│    - TestCaseManager: 用例解析/验证/优化    │
│    - PRDProcessor: PRD审查/生成用例         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. 自然语言驱动层 (browser-use 核心,保持不变)│
│    - BrowserUseAgent: 理解页面、决策操作    │
│    - CustomController: 执行浏览器操作       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 4. 浏览器抽象层 (保持不变)                  │
│    - CustomBrowser/Context                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 5. 浏览器自动化层 (Playwright)              │
└─────────────────────────────────────────────┘
关键设计原则

解耦: 业务层不直接操作浏览器,通过自然语言指令与 Agent 通信
复用: 完全保留 browser-use 核心能力 (第 3-5 层)
标准化: 测试用例统一格式,便于管理和复用
质量保证: 通过 LLM 审查确保 PRD 和用例质量
实施任务

任务文档 (tasks.md) 中列出了 10 个大任务,共约 50+ 个子任务:

项目基础配置
界面中文化和品牌定制
LLM 配置简化
业务交互层实现
测试用例管理功能
PRD 处理功能
MCP 性能优化
操作说明文档
测试和质量保证
集成和部署
非功能性需求

性能: 界面加载 < 3秒,用例解析 < 10秒
兼容性: Chrome/Edge/Firefox,Windows/macOS/Linux
安全性: API Key 加密存储,文件上传验证
可维护性: 模块化设计,详细注释
```

用户：

```markdown
🎉 Spec 创建完成总结 ✅ 已完成的文档 需求文档（requirements.md） 10 个主要需求 使用 EARS 和 INCOSE 标准 包含功能性和非功能性需求 设计文档（design.md） 五层架构设计 数据流向说明 LLM 分工明确 MCP 优化详细设计 业务交互层详细设计（layer-2-business-interaction-design.md） TestCaseManager 完整设计 PRDProcessor 完整设计 接口定义和使用示例 UAT 测试用例（uat-testcases.md） 15 个 UAT 测试用例 覆盖所有核心功能 UAT 评审记录（uat-review-record.md） 逐项评审 改进建议 补充用例建议 测试指导文档（.kiro/steering/testing-guidelines.md） 测试分类和执行流程 测试报告格式 代码审查检查清单 测试最佳实践 自动化测试 Hook（.kiro/hooks/test-on-save.json） 代码保存后自动测试 自动生成测试报告 质量保证方案（quality-assurance.md） 完整的质量保证体系 质量指标和工具 持续改进机制 任务列表（tasks.md） 10 个主任务 50+ 个子任务 需求追溯 测试任务标记为可选 补充了解以上内容
```

AI:  


```markdown
非常好！我已经完整理解了你创建的所有文档和项目规划。这是一个设计非常完善的 spec 体系：

📋 文档架构总览

需求层
├─ requirements.md (10大需求，EARS标准)
└─ uat-testcases.md (15个UAT用例)

设计层
├─ design.md (五层架构，完整技术方案)
├─ layer-2-business-interaction-design.md (业务层详细设计)
└─ ui-design-preview.md (UI设计效果)

实施层
├─ tasks.md (10大任务，50+子任务)
└─ quality-assurance.md (QA体系)

管理层
├─ testing-guidelines.md (测试规范)
├─ uat-review-record.md (评审记录)
└─ test-on-save.json (自动化Hook)
✅ 关键亮点

需求追溯性: 每个任务都标注了对应的需求编号
质量保证: 完整的测试体系（单元/集成/UAT/性能）
架构清晰: 五层架构，职责边界明确
自动化: 保存时自动测试的 Hook
风险可控: 标记可选任务，核心功能优先
🚀 准备就绪

现在可以开始实施了！建议按以下顺序推进：

推荐执行路径

阶段 1: 基础设施 (1-2天)
├─ 任务 1: 项目基础配置
├─ 任务 2: 界面中文化和品牌定制
└─ 任务 3: LLM 配置简化

阶段 2: 核心业务 (3-5天)
├─ 任务 4: 业务交互层实现
├─ 任务 5: 测试用例管理功能
└─ 任务 6: PRD 处理功能

阶段 3: 优化完善 (1-2天)
├─ 任务 7: MCP 性能优化
└─ 任务 8: 操作说明文档

阶段 4: 测试交付 (2-3天)
├─ 任务 9: 测试和质量保证
└─ 任务 10: 集成和部署
你希望现在开始实施吗？ 如果是，我建议从以下选项开始：

选项 A: 快速验证路径 (先实现可视化效果)

从任务 2 (界面中文化和品牌定制) 开始
快速看到 UI 效果，验证设计方案
选项 B: 稳健实施路径 (按顺序推进)

从任务 1 (项目基础配置) 开始
逐步构建完整系统
你更倾向于哪个选项？或者有其他想法？
```

用户：

```markdown
选项B,但在开始之前,你先对这个方案进行分析,是否有遗漏关键设计内容?如果没有,再看下任务是否合理,如果合理就按照选项B从任务1开始逐个执行,每完成一个任务就审查下任务完成情况和代码质量.
```

AI:

```markdown
📊 项目方案完整性分析

✅ 优势分析

1. 需求规范性

使用 EARS 标准，验收标准明确
10个需求覆盖所有核心功能
非功能性需求（性能、兼容性、安全性）完整
2. 架构设计

五层架构清晰，职责边界明确
业务层解耦，不破坏 browser-use 核心
LLM 分工合理（PRD审查、用例优化、规划器、主LLM）
3. 实施计划

50+ 个子任务，粒度合适
需求追溯完整
测试任务标记清晰
4. 质量保证

UAT 测试用例覆盖主要功能
自动化测试 Hook
完整的测试指南
⚠️ 关键遗漏点识别

高优先级遗漏（必须补充）

1. 测试报告生成模块 🔴

问题: 需求10提到"生成测试报告"，但设计文档中缺少测试报告模块的详细设计
影响: 无法向用户展示测试结果，用户体验不完整
建议: 需要设计：
报告数据结构（通过/失败/跳过、执行时间、截图、错误日志）
报告格式（Markdown/HTML/JSON）
报告生成时机（单个用例结束/批量结束）
报告存储和查看
2. Prompt 工程 🔴

问题: PRD 审查和用例优化是核心功能，但具体的 Prompt 设计缺失
影响: 开发时需要重新设计 Prompt，可能影响质量
建议: 需要补充：
PRD_REVIEW_PROMPT（完整版本，包含示例）
TESTCASE_OPTIMIZATION_PROMPT（用例优化的具体指令）
TESTCASE_CONVERSION_PROMPT（测试用例转自然语言的模板）
3. 测试结果验证逻辑 🔴

问题: 设计中提到"对比预期结果和实际结果"，但没有具体实现方案
影响: 无法自动判断测试通过/失败，需要人工判断
建议: 需要设计：
断言类型（页面元素存在、文本匹配、URL匹配、截图对比）
LLM 辅助验证（让 LLM 判断页面是否符合预期）
验证失败时的处理策略
4. 测试历史和日志管理 🔴

问题: 缺少测试历史记录的设计
影响: 无法追溯历史测试，不便于对比和调试
建议: 需要设计：
历史记录存储（SQLite/JSON 文件）
历史记录查询界面
日志级别和存储策略
中优先级遗漏（建议补充）

5. 批量测试用例执行 🟡

问题: 设计提到"批量执行多个测试用例"，但缺少具体实现
建议:
批量执行队列管理
执行进度展示
失败后的继续/停止策略
6. 截图和日志保存 🟡

问题: 测试失败时如何保存现场？
建议:
自动截图策略（每步操作/仅失败时）
日志文件组织结构
存储空间管理（自动清理旧日志）
7. 配置持久化 🟡

问题: 用例优化模型、PRD 审查模型的配置如何保存？
建议:
将模型配置纳入 WebuiManager 的配置管理
支持多套配置切换
低优先级遗漏（可选）

8. 并发执行控制 🟢

多个测试用例并发执行时的资源管理
9. 浏览器会话管理 🟢

测试用例之间是否共享浏览器会话？
10. 重试机制 🟢

网络失败、元素未找到时的自动重试
```

AI：

```markdown
🎯 最终评估结论

✅ 整体评价: 优秀，但需补充关键设计

评分: 8.5/10

优点:

✅ 需求规范、验收标准清晰
✅ 架构设计合理、分层清晰
✅ 任务分解详细、追溯完整
✅ 质量保证体系完善
需改进:

⚠️ 缺少测试报告模块设计（关键遗漏）
⚠️ 缺少 Prompt 工程设计（核心能力）
⚠️ 缺少测试验证逻辑设计（自动化关键）
⚠️ 缺少测试历史记录功能（用户体验）

方案 A: 稳健路径（推荐）⭐

先补充 4 个关键设计，再按照调整后的顺序执行：

阶段 0（1-2天）→ 阶段 1（1-2天）→ 阶段 2（3-5天）→ 阶段 3（1-2天）→ 阶段 4（2-3天）
优点:

✅ 核心设计完整，实施过程顺畅
✅ Prompt 质量有保证
✅ 测试报告功能完善
缺点:

⏱️ 增加 1-2 天前置设计时间
方案 B: 敏捷路径

直接从任务 1 开始，在实施过程中补充缺失设计：

在任务 4 开始前补充 Prompt 设计
在任务 5 实施时补充测试报告和验证逻辑
在任务 6 实施时补充测试历史记录
优点:

✅ 快速启动，边做边补
✅ 可以先验证 UI 效果
缺点:

⚠️ 可能需要返工修改
⚠️ Prompt 设计不足可能影响核心功能质量
🚀 我的建议

推荐选择方案 A（稳健路径），原因：

Prompt 工程是核心竞争力，需要精心设计和测试
测试报告是用户价值体现，不能缺失
测试验证是自动化的基础，提前设计可避免返工
仅增加 1-2 天，但可提升整体质量 30%+
你的决定？

A: 先补充 4 个关键设计（我来帮你设计）
B: 直接开始任务 1（边做边补）
C: 其他想法？
请告诉我你的选择，我将立即开始执行！
```

用户：

```markdown
A,你说的很对,我们要谋定而后动,特别在高优先级遗漏（必须补充）方面,另外,我们也要讨论一个方案,如何让合适的测试用例能够驱动该应用执行自动化,这个模板规范应该如何定. 另外,我们对于这么多任务,先把核心能力实现,包括语言,UI,功能逻辑,但是性能这块比如mcp性能可以先放着,优先级靠后.并且,对于复杂任务,比如提示词的设计,测试用例模板的设计,PRD的审查等,可以在主体功能完善后再详细讨论设计方案.
```

AI:

```markdown
非常好的决策！这是典型的敏捷开发思路：先实现 MVP（最小可行产品），再迭代优化。让我重新规划方案。

🎯 调整后的实施策略

核心原则

核心能力优先：语言、UI、功能逻辑
性能优化后置：MCP 优化、缓存等放到后期
复杂设计后置：Prompt、模板等先用简单版本，功能跑通后再优化
📝 关键讨论：测试用例模板规范

这是整个系统的核心，让我们先定义清楚。

设计目标

易于编写：测试人员能快速上手
易于解析：程序能准确提取信息
驱动自动化：能转换为 BrowserUseAgent 的执行指令
可验证：能自动判断测试通过/失败
格式选择：半结构化 Markdown

优点：

✅ 人类可读性强
✅ 支持版本控制（Git）
✅ 易于编辑（任何文本编辑器）
✅ 解析简单（正则表达式 + Markdown parser）
模板规范 v1.0（MVP 版本）

# 测试用例文档

## 项目信息
- **项目名称**: [填写项目名称]
- **测试版本**: [v1.0]
- **创建日期**: [2025-01-10]

---

## 用例 1: 用户登录功能测试

### 用例信息
- **用例ID**: TC001
- **优先级**: 高
- **标签**: 登录, 认证

### 前置条件
- 浏览器环境: Chrome 最新版
- 测试账号: testuser / password123
- 网络状态: 正常

### 测试步骤
1. 打开浏览器，访问 https://example.com
2. 等待页面完全加载（约3秒）
3. 找到页面右上角的"登录"按钮，点击
4. 在弹出的登录框中，找到"用户名"输入框
5. 在"用户名"输入框中输入: testuser
6. 找到"密码"输入框
7. 在"密码"输入框中输入: password123
8. 点击"提交"按钮
9. 等待页面跳转（约2秒）

### 预期结果
- ✓ 页面成功跳转到首页（URL应该是 https://example.com/home）
- ✓ 页面右上角显示文本"欢迎，testuser"
- ✓ "登录"按钮消失，出现"退出"按钮

### 异常处理
- 如果找不到登录按钮，报告失败
- 如果页面加载超过10秒，报告超时

---

## 用例 2: [下一个用例...]
关键设计点

1. 操作步骤的描述规范

最佳实践：

✅ 使用具体的元素描述："页面右上角的'登录'按钮"
✅ 明确操作对象："在'用户名'输入框中输入"
✅ 包含等待时间："等待页面完全加载（约3秒）"
✅ 使用编号列表，便于追踪
避免：

❌ 模糊描述："点击某个按钮"
❌ 缺少定位信息："输入用户名"（哪个输入框？）
❌ 缺少等待："点击后立即检查结果"（页面可能还在加载）
2. 预期结果的验证方式

MVP 版本：使用自然语言描述，由 LLM 辅助验证

### 预期结果
- ✓ 页面 URL 应该包含 "/home"
- ✓ 页面中应该存在文本"欢迎，testuser"
- ✓ 页面右上角应该有"退出"按钮
TestCaseManager 的验证逻辑：

执行完所有步骤后，让 LLM 查看页面截图
将预期结果作为 Prompt 传递给 LLM：
请查看当前页面，验证以下条件是否满足：
- 页面 URL 是否包含 "/home"？
- 页面中是否存在文本"欢迎，testuser"？
- 页面右上角是否有"退出"按钮？

请逐条检查并返回 JSON 格式：
{"条件1": true, "条件2": false, "条件3": true}
3. 测试用例 → 自然语言指令的转换

TestCaseManager.convert_to_natural_language() 的简单实现：

def convert_to_natural_language(test_case: TestCase) -> str:
    """将测试用例转换为 BrowserUseAgent 可执行的指令"""
    
    instruction = f"""
请执行以下浏览器自动化测试：

【测试目标】
{test_case.title}

【前置条件】
{'\n'.join(test_case.preconditions)}

【操作步骤】
请严格按照以下步骤执行，每一步都要确认完成后再进行下一步：
{'\n'.join([f'{i+1}. {step}' for i, step in enumerate(test_case.steps)])}

【验证要求】
完成所有步骤后，请检查页面是否满足以下条件：
{'\n'.join([f'- {result}' for result in test_case.expected_results])}

【重要提示】
- 如果遇到元素找不到的情况，请等待3秒后重试
- 如果页面加载缓慢，请耐心等待
- 完成后，请告诉我测试是否通过
"""
    return instruction
这个指令会直接传递给 BrowserUseAgent.run(instruction)

🎯 调整后的任务优先级

阶段 1: 核心基础（必须完成）⭐⭐⭐

任务 1: 项目基础配置
├─ 1.1 更新 .env.example（添加 SiliconFlow 配置）
├─ 1.2 创建项目目录结构
└─ 1.3 准备测试数据（简单样例即可）

任务 2: 界面中文化和品牌定制
├─ 2.1 界面文本中文化
├─ 2.2 蓝色主题 + Logo + 版权信息
└─ 2.3 基础 UI 测试

任务 3: LLM 配置简化
├─ 3.1 仅保留 SiliconFlow 和 DeepSeek
├─ 3.2 更新 UI 组件
└─ 3.3 配置加载测试
预期时间: 1-2 天
里程碑: UI 跑通，可以看到中文界面和品牌效果

阶段 2: 核心功能（MVP）⭐⭐⭐

任务 4: 业务交互层基础实现
├─ 4.1 定义数据模型（TestCase, PRDDocument 等）
├─ 4.2 实现 TestCaseManager（简化版）
│   ├─ 4.2.1 解析 Markdown 测试用例
│   ├─ 4.2.2 基础验证（检查必填字段）
│   ├─ 4.2.3 转换为自然语言指令（简单拼接）
│   └─ 4.2.4 执行测试用例（调用 BrowserUseAgent）
└─ 4.3 实现 PRDProcessor（简化版）
    ├─ 4.3.1 解析 PRD 文档
    ├─ 4.3.2 调用 LLM 生成测试用例（简单 Prompt）
    └─ 4.3.3 返回测试用例文档

任务 5: 测试用例管理 UI
├─ 5.1 创建测试用例模板（MVP 版本，见上文）
├─ 5.2 实现测试用例管理 UI
│   ├─ 模板下载
│   ├─ 文件上传/文本输入
│   └─ 测试用例展示
├─ 5.3 集成 TestCaseManager
│   ├─ 解析用例
│   ├─ 执行测试
│   └─ 展示结果（简单版：成功/失败 + LLM 输出）
└─ 5.4 基础测试

任务 6: PRD 处理 UI
├─ 6.1 实现 PRD 处理 UI
│   ├─ PRD 上传/输入
│   └─ 测试用例生成和展示
├─ 6.2 集成 PRDProcessor
│   └─ 生成测试用例 → 传递到测试执行
└─ 6.3 基础测试
预期时间: 3-5 天
里程碑: 核心流程打通 - PRD → 测试用例 → 自动化执行

MVP 版本简化：

❌ 暂不实现用例优化（直接执行）
❌ 暂不实现 PRD 多轮审查（直接生成用例）
❌ 暂不实现测试报告（仅显示成功/失败）
❌ 暂不实现历史记录
✅ 使用简单 Prompt（功能优先，质量后续优化）
阶段 3: 文档和集成⭐⭐

任务 8: 操作说明文档
├─ 8.1 编写基础操作说明（Markdown）
├─ 8.2 实现操作说明 UI 展示
└─ 8.3 集成到主界面

任务 10: 基础集成
├─ 10.1 更新主界面（集成所有标签页）
├─ 10.2 更新 WebuiManager
├─ 10.3 更新依赖和文档
└─ 10.4 基础集成测试
预期时间: 1-2 天
里程碑: MVP 完整可用，可以交付演示

阶段 4: 优化和完善（后续迭代）⭐

任务 7: MCP 性能优化（后置）
├─ 7.1 实现 MCP 工具缓存
├─ 7.2 实现智能工具检索
└─ 7.3 性能测试

任务 4+: 业务层增强
├─ 4+.1 设计高质量 Prompt（PRD 审查、用例优化）
├─ 4+.2 实现用例优化功能
├─ 4+.3 实现 PRD 多轮审查
├─ 4+.4 实现测试报告生成
├─ 4+.5 实现测试历史记录
└─ 4+.6 实现批量测试执行

任务 9: 完整测试
├─ 9.1 单元测试补充
├─ 9.2 集成测试
├─ 9.3 UAT 测试
└─ 9.4 性能测试
预期时间: 3-5 天
里程碑: 生产级质量

📊 MVP vs 完整版对比

功能	MVP 版本（阶段1-3）	完整版（阶段4）
界面中文化	✅ 完整	✅ 完整
品牌定制	✅ 完整	✅ 完整
LLM 配置	✅ SiliconFlow + DeepSeek	✅ 完整
测试用例管理	✅ 上传、解析、执行	✅ + 优化、历史记录
PRD 生成用例	✅ 简单生成	✅ + 多轮审查
测试报告	❌ 仅显示成功/失败	✅ 完整 HTML/Markdown 报告
测试验证	✅ LLM 辅助验证	✅ + 结构化断言
Prompt 质量	⚠️ 基础版本	✅ 精心设计
MCP 优化	❌ 使用原有实现	✅ 缓存 + 智能检索
操作说明	✅ 基础文档	✅ 详细文档
🎯 下一步行动

现在让我整理完整的实施计划，包括：

阶段 1-3 的详细任务清单（MVP 版本）
测试用例模板规范文档（供开发时参考）
简化版 Prompt 模板（先跑通，后优化）
验收标准（每个阶段完成后的检查点）
准备好了吗？我现在提交完整的实施计划给你审阅。
```

用户：

```markdown
先别急,让我们再讨论一些问题,然后定一个好实现的MVP版本 1. 自动化测试用例的话需要设计用例的断言,我们应该如何让测试文档设计断言? 2. 自动化测试需要将每一个用例都独立作为一个测试脚本,因为需要一个测试用例无法测试成功时不阻塞其他测试用例,这块是比较复杂的,这块要如何设计?我们本次可以先实现一个测试用例的执行. 3. AI驱动的浏览器自动化测试如果还需要人去提前遍历所有页面,然后初始化页面树和功能清单,类似传统的自动化方式,那效率实在太低了,需要人花大量时间去对系统进行梳理.我希望是能够让AI自行去遍历系统的网页,把每一个按钮都点击一遍,如果循环跳转了,又调回原先的UI页面了,那url应该是一样的,至少在?参数之前是一样的,所以一旦进入了同一个Url的页面,就算这个树遍历到末端节点了,要返回重新遍历.每一个Url页面需要截个图,这样就能把一个系统所有页面都遍历下来,业界应该有成熟方案来爬取整个网站的所有页面的,只是有些数据是后端给的,不是前端写死的.
```

AI：

```markdown
非常好的问题！这三个问题直击 AI 自动化测试的核心挑战。让我们逐个深入讨论。

🎯 问题 1: 测试断言设计

传统自动化 vs AI 驱动自动化的断言差异

传统自动化：

# 精确断言
assert driver.find_element(By.ID, "username").is_displayed()
assert page_title == "登录页面"
assert current_url.endswith("/home")
AI 驱动自动化：

### 预期结果
- 页面右上角应该显示用户名
- 页面 URL 应该变为首页
- 应该能看到"退出"按钮
MVP 版本断言设计方案

方案 A: 自然语言断言 + LLM 验证（推荐用于 MVP）

测试用例模板：

### 预期结果
- [断言1] 页面 URL 应该包含 "/home"
- [断言2] 页面右上角应该显示文本"欢迎，testuser"
- [断言3] 页面中不应该存在"登录"按钮
- [断言4] 页面中应该存在"退出"按钮
验证实现（简化版）：

async def verify_expectations(expectations: List[str], page_screenshot: bytes) -> dict:
    """使用 LLM 验证预期结果"""
    
    prompt = f"""
请查看当前页面截图，验证以下断言是否成立：

{chr(10).join([f'{i+1}. {exp}' for i, exp in enumerate(expectations)])}

请逐条检查，返回 JSON 格式：
{{
  "results": [
    {{"assertion": "断言1", "passed": true, "reason": "URL 确实包含 /home"}},
    {{"assertion": "断言2", "passed": false, "reason": "未找到指定文本"}},
    ...
  ],
  "overall": "pass/fail"
}}
"""
    
    # 调用 Vision LLM（如 Qwen3-VL）
    result = await vision_llm.invoke(prompt, images=[page_screenshot])
    return parse_json(result)
优点：

✅ 简单易实现
✅ 灵活（支持各种断言表达）
✅ 适合 MVP
缺点：

⚠️ 依赖 LLM 能力（需要视觉模型）
⚠️ 可能不够精确（但对 MVP 够用）
方案 B: 结构化断言 + 混合验证（未来版本）

### 预期结果

#### 断言 1: URL 验证
- 类型: url_contains
- 期望值: "/home"

#### 断言 2: 元素存在性
- 类型: element_exists
- 元素描述: 页面右上角的用户名
- 期望文本: "欢迎，testuser"

#### 断言 3: 元素不存在
- 类型: element_not_exists
- 元素描述: 登录按钮

#### 断言 4: 视觉验证
- 类型: visual_check
- 描述: 页面顶部应该有导航栏，包含"首页"、"产品"、"关于我们"三个链接
验证实现：

def verify_structured_assertion(assertion: dict, page_state: dict):
    if assertion['type'] == 'url_contains':
        return assertion['expected'] in page_state['url']
    
    elif assertion['type'] == 'element_exists':
        # 让 LLM 在页面中找元素
        return llm_find_element(assertion['description'], page_state['screenshot'])
    
    elif assertion['type'] == 'visual_check':
        # 完全由 LLM 判断
        return llm_visual_verify(assertion['description'], page_state['screenshot'])
优点：

✅ 更精确
✅ 部分断言可以程序化验证（提高速度）
缺点：

❌ 复杂，不适合 MVP
❌ 学习成本高
MVP 决策：使用方案 A

理由：

实现简单，1-2 天可完成
利用 LLM 的视觉能力，降低复杂度
用户易于理解和编写
测试用例模板更新：

### 预期结果
描述测试通过时页面应该呈现的状态，AI 将根据截图验证这些条件：

- 页面 URL 应该包含 "/home"（或其他明确的 URL 特征）
- 页面中应该显示文本"欢迎，testuser"
- 页面右上角应该有"退出"按钮（明确位置）
- "登录"按钮应该消失（说明已登录）

提示：描述越具体，AI 验证越准确。建议包括位置、颜色等视觉特征。
🎯 问题 2: 测试用例隔离

你的观察非常正确！这是自动化测试的核心问题。

问题分析

场景：

测试套件：
├─ TC001: 登录测试（执行正常）
├─ TC002: 商品搜索测试（失败，阻塞了后续）
├─ TC003: 购物车测试（未执行）❌
└─ TC004: 结账测试（未执行）❌
传统方案：

Pytest: 每个测试用例是独立的 function，失败不影响其他
Selenium Grid: 并行执行多个浏览器会话
在 browser-use 中的挑战：

当前实现是单 Agent 顺序执行
一个任务失败会影响后续任务
MVP 方案：单用例执行 + 会话隔离

设计思路：

class TestCaseExecutor:
    async def execute_single_testcase(self, test_case: TestCase) -> TestResult:
        """执行单个测试用例（独立会话）"""
        
        # 1. 创建独立的浏览器会话
        browser = None
        try:
            # 每个测试用例启动新的浏览器
            browser = await self.create_fresh_browser()
            agent = BrowserUseAgent(browser=browser, llm=self.llm)
            
            # 2. 执行测试
            instruction = self.testcase_manager.convert_to_natural_language(test_case)
            result = await agent.run(instruction)
            
            # 3. 验证预期结果
            verification = await self.verify_expectations(
                expectations=test_case.expected_results,
                page_screenshot=await browser.screenshot()
            )
            
            return TestResult(
                testcase_id=test_case.id,
                status="pass" if verification['overall'] == "pass" else "fail",
                verification_details=verification,
                execution_log=result.history
            )
        
        except Exception as e:
            return TestResult(
                testcase_id=test_case.id,
                status="error",
                error_message=str(e)
            )
        
        finally:
            # 4. 清理：关闭浏览器
            if browser:
                await browser.close()
UI 实现：

# src/webui/components/testcase_management_tab.py

def create_testcase_management_tab():
    with gr.Column():
        # ... 用例上传、展示 ...
        
        # 测试执行区域
        gr.Markdown("## 测试执行")
        testcase_selector = gr.Dropdown(
            label="选择要执行的测试用例",
            choices=[],  # 从解析的用例中动态加载
            info="单个测试用例执行（MVP 版本）"
        )
        
        execute_btn = gr.Button("执行测试", variant="primary")
        
        # 执行结果展示
        with gr.Row():
            status_output = gr.Textbox(label="测试状态")
            result_output = gr.JSON(label="验证结果")
        
        execution_log = gr.Textbox(
            label="执行日志",
            lines=10,
            max_lines=20
        )
        
        # 绑定执行事件
        execute_btn.click(
            fn=execute_single_testcase,
            inputs=[testcase_selector],
            outputs=[status_output, result_output, execution_log]
        )
未来版本：批量执行 + 并行

class BatchTestExecutor:
    async def execute_testcases_batch(self, test_cases: List[TestCase]) -> BatchResult:
        """批量执行测试用例（并行）"""
        
        # 使用 asyncio.gather 并行执行
        tasks = [
            self.execute_single_testcase(tc) 
            for tc in test_cases
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return BatchResult(
            total=len(test_cases),
            passed=sum(1 for r in results if r.status == "pass"),
            failed=sum(1 for r in results if r.status == "fail"),
            errors=sum(1 for r in results if r.status == "error"),
            details=results
        )
MVP 决策：仅支持单用例执行

理由：

✅ 简化实现（无需并发控制）
✅ 降低资源消耗（单浏览器实例）
✅ 便于调试
✅ 对于 MVP 演示足够
用户体验：

1. 用户上传测试用例文档（包含 5 个用例）
2. 系统解析后，显示用例列表
3. 用户选择"TC001: 登录测试"
4. 点击"执行测试"
5. 实时看到执行过程（通过 Gradio 的流式输出）
6. 看到测试结果：通过 ✅ / 失败 ❌
7. 查看详细验证报告
🎯 问题 3: 智能页面遍历（网站爬取）

这是一个非常创新的想法！本质上是要实现一个 AI 驱动的 Web Crawler。

业务价值

传统方式（手工梳理）：

测试人员需要：
1. 手动访问系统每个页面
2. 记录页面 URL、功能、元素
3. 绘制页面流程图
4. 编写测试用例

耗时：2-5 天（中等规模系统）
AI 自动遍历：

系统自动：
1. 从首页开始，递归点击所有可点击元素
2. 自动截图、记录 URL
3. 自动生成页面树
4. 自动生成功能清单

耗时：30 分钟 - 2 小时（取决于系统复杂度）
技术方案设计

核心算法：广度优先遍历 (BFS)

class IntelligentWebCrawler:
    def __init__(self, start_url: str, llm):
        self.start_url = start_url
        self.llm = llm
        self.visited_urls = set()  # 已访问的 URL（去参数）
        self.page_tree = {}  # 页面树
        self.screenshots = {}  # 页面截图
    
    def normalize_url(self, url: str) -> str:
        """标准化 URL（去除查询参数和 hash）"""
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    
    async def crawl(self, max_depth: int = 3, max_pages: int = 50):
        """智能爬取整个网站"""
        
        queue = [(self.start_url, 0, None)]  # (url, depth, parent_url)
        
        while queue and len(self.visited_urls) < max_pages:
            current_url, depth, parent_url = queue.pop(0)
            
            # 标准化 URL
            normalized_url = self.normalize_url(current_url)
            
            # 检查是否已访问
            if normalized_url in self.visited_urls:
                continue
            
            # 检查深度
            if depth > max_depth:
                continue
            
            # 访问页面
            page_info = await self.visit_page(current_url)
            
            # 记录
            self.visited_urls.add(normalized_url)
            self.page_tree[normalized_url] = {
                "url": current_url,
                "depth": depth,
                "parent": parent_url,
                "title": page_info['title'],
                "clickable_elements": page_info['clickable_elements'],
                "screenshot": page_info['screenshot']
            }
            self.screenshots[normalized_url] = page_info['screenshot']
            
            # 发现新页面
            for element in page_info['clickable_elements']:
                if element['type'] in ['link', 'button']:
                    # 点击元素，获取跳转 URL
                    target_url = await self.click_and_get_url(current_url, element)
                    
                    if target_url:
                        normalized_target = self.normalize_url(target_url)
                        
                        # 只添加未访问的 URL
                        if normalized_target not in self.visited_urls:
                            queue.append((target_url, depth + 1, normalized_url))
            
        return self.generate_report()
    
    async def visit_page(self, url: str) -> dict:
        """访问页面，提取信息"""
        
        browser = await self.create_browser()
        page = await browser.new_page()
        
        try:
            # 访问页面
            await page.goto(url, wait_until="networkidle")
            
            # 截图
            screenshot = await page.screenshot(full_page=True)
            
            # 获取页面标题
            title = await page.title()
            
            # 使用 LLM 识别可点击元素
            clickable_elements = await self.find_clickable_elements(page, screenshot)
            
            return {
                "title": title,
                "clickable_elements": clickable_elements,
                "screenshot": screenshot
            }
        
        finally:
            await browser.close()
    
    async def find_clickable_elements(self, page, screenshot: bytes) -> List[dict]:
        """使用 LLM 识别页面中所有可点击元素"""
        
        prompt = """
请分析这个页面截图，识别所有可点击的元素（链接、按钮、图标等）。

对于每个元素，返回：
1. 元素类型（link/button/icon）
2. 元素文本或描述
3. 元素位置（大致区域：顶部/左侧/中间/右侧/底部）

返回 JSON 格式：
[
  {"type": "link", "text": "登录", "location": "右上角"},
  {"type": "button", "text": "搜索", "location": "顶部导航栏"},
  ...
]

注意：忽略重复的元素（如多个"详情"按钮）。
"""
        
        result = await self.llm.invoke(prompt, images=[screenshot])
        return parse_json(result)
    
    async def click_and_get_url(self, current_url: str, element: dict) -> str:
        """点击元素，获取跳转后的 URL"""
        
        browser = await self.create_browser()
        page = await browser.new_page()
        
        try:
            await page.goto(current_url, wait_until="networkidle")
            
            # 使用 LLM 驱动点击元素
            agent = BrowserUseAgent(browser=browser, llm=self.llm)
            await agent.run(f"点击页面中的'{element['text']}'")
            
            # 等待页面跳转
            await asyncio.sleep(2)
            
            # 获取当前 URL
            return page.url
        
        except Exception as e:
            print(f"点击元素失败: {element['text']}, 错误: {e}")
            return None
        
        finally:
            await browser.close()
    
    def generate_report(self) -> dict:
        """生成爬取报告"""
        
        return {
            "total_pages": len(self.visited_urls),
            "page_tree": self.page_tree,
            "screenshots": self.screenshots,
            "url_list": list(self.visited_urls)
        }
挑战和限制

挑战 1: 无限循环检测

# 示例：翻页按钮
# 点击"下一页" → URL 变为 /list?page=2
# 再点"下一页" → URL 变为 /list?page=3
# 一直循环...

# 解决方案：识别分页模式
def is_pagination(url1: str, url2: str) -> bool:
    # 检查是否只有 page 参数不同
    parsed1 = urlparse(url1)
    parsed2 = urlparse(url2)
    
    if parsed1.path != parsed2.path:
        return False
    
    params1 = parse_qs(parsed1.query)
    params2 = parse_qs(parsed2.query)
    
    # 只有 page 参数不同
    return (params1.keys() == params2.keys() and 
            'page' in params1 and 
            params1.get('page') != params2.get('page'))
挑战 2: 需要登录的页面

# 解决方案：提供初始化步骤
crawler = IntelligentWebCrawler(
    start_url="https://example.com",
    llm=llm,
    init_steps=[
        "点击右上角的'登录'按钮",
        "输入用户名: testuser",
        "输入密码: password123",
        "点击'提交'按钮"
    ]
)
挑战 3: 动态内容

# 问题：后端数据动态生成的列表项
# 例如：电商网站的商品列表

# 解决方案：模式识别
def detect_repeating_patterns(elements: List[dict]) -> List[dict]:
    """检测重复模式，只保留一个代表"""
    
    # 例如：10 个"查看详情"按钮 → 只点击 1 个
    unique_elements = {}
    for elem in elements:
        key = (elem['type'], elem['text'])
        if key not in unique_elements:
            unique_elements[key] = elem
    
    return list(unique_elements.values())
MVP 决策：暂不纳入核心流程，作为独立工具

理由：

❌ 复杂度高（需要 2-3 天开发 + 测试）
❌ 对 MVP 演示不是必需的
❌ 性能开销大（需要多次启动浏览器）
❌ 可能遇到各种边界情况
建议：

✅ 在 MVP 完成后，作为独立功能模块开发
✅ 放在"高级功能"标签页中
✅ 提供"智能站点爬取"按钮，生成页面地图
未来版本的位置

标签页：🔍 智能探索（新增）

功能：
1. 输入起始 URL
2. 配置爬取深度和页面数限制
3. （可选）提供登录步骤
4. 点击"开始探索"
5. 实时显示进度（已访问 15/50 页面）
6. 生成结果：
   - 页面树（可视化）
   - 所有页面截图（画廊展示）
   - 页面功能清单（AI 自动总结）
   - 导出为 JSON/Markdown
🎯 最终 MVP 范围定义

基于以上讨论，我重新定义 MVP 范围：

✅ 纳入 MVP

核心功能：

✅ 界面中文化 + 品牌定制
✅ LLM 配置简化（SiliconFlow + DeepSeek）
✅ 测试用例管理：
模板下载
上传/输入测试用例
解析测试用例
单个测试用例执行
自然语言断言 + LLM 验证
简单结果展示（通过/失败 + 原因）
✅ PRD 生成测试用例：
上传 PRD
LLM 生成测试用例（简单 Prompt）
生成的用例可直接执行
✅ 基础操作说明文档
简化：

⚠️ 无测试报告生成（仅显示结果）
⚠️ 无测试历史记录
⚠️ 无用例优化功能
⚠️ 无 PRD 多轮审查
⚠️ 无批量测试执行
⚠️ 简单 Prompt（质量优先级低）
❌ 不纳入 MVP（后续迭代）

❌ MCP 性能优化
❌ 智能页面遍历/爬取
❌ 批量测试执行
❌ 并行测试
❌ 结构化断言
❌ 完整测试报告
❌ 测试历史记录
❌ 用例优化
❌ PRD 多轮审查
❌ 高质量 Prompt 设计（先用简单版本）
📋 准备提交实施计划

现在我将整理：

MVP 详细任务清单（阶段 1-3）
测试用例模板规范（包含自然语言断言）
简化版 Prompt 模板
每阶段的验收标准
准备好了吗？我现在使用 ExitPlanMode 提交完整的 MVP 实施计划。
```

用户：

```markdown
综上,我们要先考虑到这个问题的存在,但是本次实现先完成MVP的部分,支持一个独立的测试用例即可,这个测试用例不需要我提前给你整个系统的功能,而是靠测试用例自动去打开网页来边看边点,当然也可以分成2步实现,第一步遍历网页,第二步根据遍历的网页所梳理的树结构和功能清单来根据测试用例执行具体的测试工作
```

AI：

```markdown
非常好！你的思路非常清晰，这确实是真正的 AI 驱动测试的发展路径。让我确认一下理解：

🎯 MVP 核心定位确认

当前 browser-use 的能力基线

browser-use 的强项是：

测试用例（自然语言描述）：
1. 打开 https://example.com
2. 点击页面右上角的"登录"按钮
3. 在用户名输入框中输入 "testuser"
4. 在密码输入框中输入 "password123"
5. 点击"提交"按钮
6. 等待页面跳转

Agent 行为：
- 自己在页面中找到"登录"按钮（不需要 XPath）
- 自己识别输入框（不需要 ID）
- 自己判断页面是否跳转

优势：无需元素定位，但需要明确的步骤描述
你期望的未来能力（两步走）

第一步：智能探索阶段（独立工具）

输入：https://example.com
输出：
  页面地图：
  ├─ 首页 (/)
  │  ├─ 功能：登录入口（右上角）
  │  ├─ 功能：产品列表
  │  └─ 功能：搜索框
  ├─ 登录页 (/login)
  │  ├─ 功能：用户名密码登录
  │  └─ 功能：忘记密码
  └─ 用户中心 (/profile)
     ├─ 功能：个人信息编辑
     └─ 功能：退出登录

用途：让 AI 和测试人员都了解系统结构
第二步：智能测试阶段（基于探索结果）

测试用例（高层描述）：
目标：验证用户登录功能
步骤：
1. 从首页进入登录页面
2. 使用测试账号登录
3. 验证进入用户中心

Agent 行为：
- 查阅页面地图，知道登录入口在首页右上角
- 知道登录页面的 URL 是 /login
- 知道登录需要用户名和密码
- 自己规划执行路径

优势：测试用例更抽象，AI 自主性更强
🎯 MVP 范围最终确认

基于讨论，我理解 MVP 应该实现：

✅ MVP 包含的功能

1. 基础设施

✅ 界面中文化 + 品牌定制
✅ LLM 配置（SiliconFlow + DeepSeek）
2. 测试用例管理

✅ 测试用例模板（详细步骤描述）
✅ 上传/输入测试用例
✅ 解析测试用例
✅ 单个测试用例执行（利用 browser-use 现有能力）
✅ 自然语言断言 + LLM 验证
✅ 简单结果展示
测试用例格式（详细步骤，Agent 按步执行）：

## 用例 1: 用户登录功能测试

### 测试步骤
1. 打开浏览器，访问 https://example.com
2. 等待页面加载完成
3. 找到页面右上角的"登录"按钮，点击
4. 等待登录框弹出或跳转到登录页面
5. 在"用户名"输入框中输入: testuser
6. 在"密码"输入框中输入: password123
7. 点击"提交"按钮
8. 等待页面跳转

### 预期结果
- 页面 URL 应该变为 https://example.com/home 或包含 /home
- 页面右上角应该显示"欢迎，testuser"
- "登录"按钮应该消失，出现"退出"按钮
3. PRD 生成测试用例

✅ 上传 PRD
✅ LLM 生成详细测试用例（包含具体步骤）
✅ 生成的用例可直接执行
4. 操作说明文档

✅ 基础使用指南
❌ MVP 不包含（后续迭代）

阶段 2：智能探索工具（独立功能模块）

❌ 智能页面遍历
❌ 页面树生成
❌ 功能清单自动提取
阶段 3：高级测试能力

❌ 基于页面树的智能测试
❌ 高层描述的测试用例（AI 自己规划路径）
❌ 批量/并行测试
❌ 完整测试报告
❌ 测试历史记录
阶段 4：性能优化

❌ MCP 性能优化
❌ 高质量 Prompt 设计
📋 MVP 实施计划

阶段 1: 基础设施（1-2 天）

任务 1: 项目基础配置
├─ 1.1 更新 .env.example
│   ├─ 添加 SILICONFLOW_API_KEY
│   ├─ 添加 SILICONFLOW_ENDPOINT
│   ├─ 添加 SILICONFLOW_MAIN_MODEL=Qwen/Qwen3-VL-235B-A22B-Thinking
│   ├─ 添加 SILICONFLOW_PLANNER_MODEL=deepseek-ai/DeepSeek-V3.2-Exp
│   ├─ 添加 LOGO_PATH=/Users/sunshunda/Desktop/.../img/logo.png
│   ├─ 添加 COPYRIGHT_TEXT=Copyright © 孙顺达
│   └─ 添加 THEME_COLOR=#005BF5
│
├─ 1.2 创建项目目录结构
│   ├─ mkdir -p src/utils/models
│   ├─ mkdir -p templates
│   ├─ mkdir -p docs
│   └─ mkdir -p tests/fixtures
│
└─ 1.3 准备测试样例数据
    ├─ 创建 tests/fixtures/sample_testcase.md（简单登录用例）
    └─ 创建 tests/fixtures/sample_prd.md（登录功能 PRD）

任务 2: 界面中文化和品牌定制
├─ 2.1 修改主界面（src/webui/interface.py）
│   ├─ 添加自定义主题（蓝色 #005BF5）
│   ├─ 添加自定义 CSS（渐变背景、卡片样式）
│   ├─ 添加顶部导航栏（Logo + 标题 + 版权）
│   └─ 更新标签页名称为中文
│
├─ 2.2 修改各个组件（中文化）
│   ├─ src/webui/components/agent_settings_tab.py
│   ├─ src/webui/components/browser_settings_tab.py
│   ├─ src/webui/components/browser_use_agent_tab.py
│   └─ src/webui/components/load_save_config_tab.py
│
└─ 2.3 验证 Logo 文件存在
    └─ 检查 /Users/sunshunda/Desktop/.../img/logo.png

任务 3: LLM 配置简化
├─ 3.1 修改 src/utils/config.py
│   ├─ 仅保留 siliconflow 和 deepseek
│   ├─ 注释掉其他提供商
│   └─ 设置 DEFAULT_LLM = "siliconflow"
│
├─ 3.2 修改 src/utils/llm_provider.py
│   ├─ 实现 SiliconFlow 双协议支持（OpenAI/Anthropic）
│   └─ 注释掉其他提供商的实现
│
└─ 3.3 更新 agent_settings_tab.py
    └─ 下拉菜单仅显示 SiliconFlow 和 DeepSeek

验收标准：
✓ 启动应用，看到中文界面
✓ 看到蓝色主题和 Logo
✓ LLM 配置只有两个选项
✓ 可以成功加载配置
阶段 2: 核心功能（3-4 天）

任务 4: 业务交互层基础实现
├─ 4.1 创建数据模型（src/utils/models.py）
│   ├─ @dataclass TestCase
│   │   ├─ id: str
│   │   ├─ title: str
│   │   ├─ preconditions: List[str]
│   │   ├─ steps: List[str]
│   │   ├─ expected_results: List[str]
│   │   ├─ priority: str
│   │   └─ tags: List[str]
│   │
│   ├─ @dataclass TestCaseDocument
│   │   ├─ project_name: str
│   │   ├─ version: str
│   │   └─ test_cases: List[TestCase]
│   │
│   ├─ @dataclass TestResult
│   │   ├─ testcase_id: str
│   │   ├─ status: str  # pass/fail/error
│   │   ├─ verification_details: dict
│   │   └─ execution_log: str
│   │
│   └─ @dataclass PRDDocument
│       ├─ title: str
│       ├─ content: str
│       └─ generated_testcases: Optional[TestCaseDocument]
│
├─ 4.2 实现 TestCaseManager（src/utils/testcase_manager.py）
│   │
│   ├─ 4.2.1 parse_testcase_document(markdown: str) -> TestCaseDocument
│   │   ├─ 使用正则表达式提取用例
│   │   ├─ 提取用例 ID、标题、步骤、预期结果
│   │   └─ 返回 TestCaseDocument 对象
│   │
│   ├─ 4.2.2 validate_testcase(test_case: TestCase) -> bool
│   │   ├─ 检查必填字段
│   │   ├─ 检查步骤是否为空
│   │   └─ 返回验证结果
│   │
│   ├─ 4.2.3 convert_to_natural_language(test_case: TestCase) -> str
│   │   ├─ 拼接提示词模板
│   │   ├─ 包含：目标、前置条件、步骤、预期结果
│   │   └─ 返回完整的指令字符串
│   │
│   ├─ 4.2.4 execute_testcase(test_case: TestCase) -> TestResult
│   │   ├─ 创建独立浏览器会话
│   │   ├─ 转换为自然语言指令
│   │   ├─ 调用 BrowserUseAgent.run()
│   │   ├─ 获取最终页面截图
│   │   ├─ 调用 verify_expectations()
│   │   ├─ 关闭浏览器
│   │   └─ 返回 TestResult
│   │
│   └─ 4.2.5 verify_expectations(expectations: List[str], screenshot: bytes) -> dict
│       ├─ 构建验证 Prompt
│       ├─ 调用 Vision LLM（Qwen3-VL）
│       ├─ 解析 JSON 结果
│       └─ 返回验证详情
│
└─ 4.3 实现 PRDProcessor（src/utils/prd_processor.py）
    │
    ├─ 4.3.1 parse_prd(content: str) -> PRDDocument
    │   ├─ 提取标题和内容
    │   └─ 返回 PRDDocument 对象
    │
    └─ 4.3.2 generate_testcases(prd: PRDDocument) -> TestCaseDocument
        ├─ 构建生成 Prompt（简单版本）
        ├─ 调用 LLM（DeepSeek-V3）
        ├─ 解析生成的 Markdown
        ├─ 转换为 TestCaseDocument
        └─ 返回测试用例

任务 5: 测试用例管理 UI
├─ 5.1 创建测试用例模板（templates/testcase_template.md）
│   ├─ 包含：项目信息、用例格式、编写规范
│   └─ 提供示例用例（登录测试）
│
├─ 5.2 实现 UI（src/webui/components/testcase_management_tab.py）
│   │
│   ├─ 模板下载按钮
│   │   └─ gr.File(value="templates/testcase_template.md")
│   │
│   ├─ 用例上传/输入
│   │   ├─ gr.File(label="上传测试用例文档")
│   │   └─ gr.Textbox(label="或直接输入测试用例", lines=10)
│   │
│   ├─ 用例解析和展示
│   │   ├─ 解析按钮 → 调用 TestCaseManager.parse_testcase_document()
│   │   ├─ 显示解析结果（用例列表）
│   │   └─ gr.Dropdown(label="选择要执行的测试用例")
│   │
│   ├─ 测试执行
│   │   ├─ gr.Button("执行测试")
│   │   ├─ 进度显示（gr.Textbox，实时更新）
│   │   └─ 结果展示（gr.JSON）
│   │
│   └─ 结果展示区域
│       ├─ 测试状态：通过 ✅ / 失败 ❌ / 错误 ⚠️
│       ├─ 验证详情：JSON 格式展示断言结果
│       └─ 执行日志：Agent 的操作记录
│
└─ 5.3 集成到主界面（src/webui/interface.py）
    └─ 添加"📝 测试用例管理"标签页

任务 6: PRD 处理 UI
├─ 6.1 实现 UI（src/webui/components/prd_to_testcase_tab.py）
│   │
│   ├─ PRD 上传/输入
│   │   ├─ gr.File(label="上传 PRD 文档")
│   │   └─ gr.Textbox(label="或直接输入 PRD", lines=15)
│   │
│   ├─ 生成测试用例
│   │   ├─ gr.Button("生成测试用例")
│   │   ├─ 调用 PRDProcessor.generate_testcases()
│   │   └─ 显示生成进度
│   │
│   ├─ 测试用例展示
│   │   ├─ gr.Textbox(label="生成的测试用例", lines=20)
│   │   └─ gr.File(label="下载测试用例文档")
│   │
│   └─ 快速执行
│       ├─ gr.Button("直接执行测试")
│       └─ 复用 TestCaseManager.execute_testcase()
│
└─ 6.2 集成到主界面
    └─ 添加"📄 PRD 生成用例"标签页

验收标准：
✓ 可以下载测试用例模板
✓ 可以上传测试用例并解析
✓ 可以选择一个用例并执行
✓ 看到执行过程和结果
✓ 可以上传 PRD 并生成测试用例
✓ 生成的用例可以直接执行
阶段 3: 文档和集成（1 天）

任务 7: 操作说明文档
├─ 7.1 编写文档（docs/user_guide.md）
│   ├─ 平台简介
│   ├─ 快速开始
│   ├─ LLM 配置指南
│   ├─ 测试用例编写规范
│   │   ├─ 格式说明
│   │   ├─ 步骤描述规范
│   │   └─ 断言编写建议
│   ├─ PRD 编写建议
│   └─ 常见问题
│
├─ 7.2 实现 UI（src/webui/components/user_guide_tab.py）
│   ├─ 读取 Markdown 文档
│   ├─ 使用 gr.Markdown 展示
│   └─ 提供下载按钮
│
└─ 7.3 集成到主界面
    └─ 添加"📖 操作说明"标签页

任务 8: 最终集成和测试
├─ 8.1 更新 WebuiManager
│   ├─ 添加 testcase_manager 实例
│   ├─ 添加 prd_processor 实例
│   └─ 更新配置管理
│
├─ 8.2 更新 requirements.txt
│   └─ 确保所有依赖已添加
│
├─ 8.3 端到端测试
│   ├─ 测试完整流程：上传 PRD → 生成用例 → 执行测试
│   ├─ 测试配置保存/加载
│   └─ 测试各个 UI 组件
│
└─ 8.4 更新文档
    ├─ 更新 README.md
    └─ 更新 CLAUDE.md

验收标准：
✓ 所有标签页正常工作
✓ 完整流程可以跑通
✓ 配置可以保存/加载
✓ 文档完整清晰
🎯 关键设计细节

1. 简化版 Prompt 模板

测试用例转指令 Prompt

TESTCASE_TO_INSTRUCTION_TEMPLATE = """
你是一个浏览器自动化测试执行助手。请严格按照以下测试用例执行操作。

【测试目标】
{title}

【前置条件】
{preconditions}

【操作步骤】
请按照以下步骤逐步执行，每完成一步后确认成功再进行下一步：
{steps}

【验证要求】
完成所有步骤后，请检查页面状态是否符合以下预期：
{expected_results}

【执行要求】
1. 严格按照步骤顺序执行
2. 如果某个元素找不到，等待 3 秒后重试
3. 如果页面加载缓慢，请耐心等待
4. 执行过程中如遇到问题，记录错误信息
5. 完成后告诉我测试是否通过
"""
预期结果验证 Prompt

EXPECTATION_VERIFICATION_TEMPLATE = """
请查看当前页面截图，验证以下断言是否成立：

{expectations}

请逐条检查每个断言，返回 JSON 格式：
{{
  "results": [
    {{"assertion": "断言1的描述", "passed": true, "reason": "通过的原因"}},
    {{"assertion": "断言2的描述", "passed": false, "reason": "未通过的原因"}},
    ...
  ],
  "overall": "pass"  // 或 "fail"
}}

注意：
- 如果所有断言都通过，overall 为 "pass"
- 只要有一个断言未通过，overall 为 "fail"
- reason 字段要详细说明判断依据
"""
PRD 生成测试用例 Prompt

PRD_TO_TESTCASE_TEMPLATE = """
你是一个测试用例设计专家。请根据以下 PRD 文档生成详细的测试用例。

【PRD 内容】
{prd_content}

【生成要求】
1. 仔细分析 PRD，理解功能需求和用户场景
2. 为每个核心功能生成 1-2 个测试用例
3. 测试用例应包含：
   - 用例 ID（TC001, TC002...）
   - 用例标题
   - 测试目标
   - 前置条件
   - 详细的操作步骤（每步都要具体明确）
   - 预期结果（用自然语言描述断言）
   - 优先级（高/中/低）
   - 标签

【输出格式】
请严格按照以下 Markdown 格式输出：

# 测试用例文档

## 项目信息
- **项目名称**: [从 PRD 中提取]
- **测试版本**: v1.0
- **创建日期**: {today_date}

---

## 用例 1: [用例标题]

### 用例信息
- **用例ID**: TC001
- **优先级**: 高
- **标签**: [功能模块]

### 前置条件
- [列出前置条件]

### 测试步骤
1. [第一步，要具体到操作对象]
2. [第二步]
...

### 预期结果
- [第一个断言]
- [第二个断言]
...

---

## 用例 2: ...

【重要提示】
- 操作步骤要足够详细，包含等待时间
- 元素描述要清晰（如"页面右上角的登录按钮"）
- 预期结果要可验证
"""
2. 测试用例模板（MVP 版本）

详见我之前提供的模板，关键点：

✅ 详细的步骤描述（包含位置、等待时间）
✅ 自然语言断言
✅ 清晰的格式（易于解析）
🚀 实施计划总结

时间估算

阶段 1（基础设施）：1-2 天
阶段 2（核心功能）：3-4 天
阶段 3（文档集成）：1 天
总计：5-7 天
里程碑

Milestone 1（第 2 天）：界面中文化完成，可以看到效果
Milestone 2（第 5 天）：核心功能完成，可以执行测试
Milestone 3（第 7 天）：MVP 完成，可以交付演示
验收标准

✅ 界面全中文，品牌元素正确显示
✅ 可以上传/输入测试用例并执行
✅ 可以从 PRD 生成测试用例
✅ 测试结果清晰展示（通过/失败 + 原因）
✅ 操作说明文档完整
未来迭代

📌 迭代 2：智能页面遍历工具（2-3 天）
📌 迭代 3：基于页面树的高级测试（3-5 天）
📌 迭代 4：批量测试、报告、历史记录（3-5 天）
📌 迭代 5：性能优化、Prompt 优化（2-3 天）
准备好开始了吗？我现在提交完整的 MVP 实施计划！
```

用户：

```markdown
所以说白了这个产品的最终形态是2个步骤,一是通过AI对整个系统或某个模块的功能进行遍历截图,生成功能清单和页面结构,便于后续定位.二是根据测试用例和功能清单/页面结构来执行自动化测试.这里在第一步和第二步中都需要考虑无限循环的问题,要发现时及时退出,避免重复测试差不多页面功能的内容. 以上,你最终整理成一个文档,并生成web_atuo_use.md文档到项目根目录下,并标记迭代计划,并详细描述本次第一步MVP的方案.
```

AI:

```markdown
完美！我现在整理完整的产品方案文档，包含产品愿景、两阶段设计、无限循环处理、迭代计划和 MVP 详细方案。
{
  "plan": "# 实施计划：浏览器 AI 自动化测试平台\n\n## 📋 总体方案\n\n创建 `web_auto_use.md` 文档，完整描述产品的：\n\n### 1. 产品愿景\n- **最终形态**：真正的 AI 驱动测试（两阶段）\n  - 阶段 A：智能探索（AI 遍历系统，生成页面树和功能清单）\n  - 阶段 B：智能测试（基于功能清单执行测试用例）\n- **核心价值**：测试人员无需手工梳理系统，AI 自动理解系统结构\n\n### 2. 关键技术方案\n- **无限循环检测**：\n  - URL 规范化（去参数）\n  - 分页模式识别\n  - 访问深度限制\n  - 页面相似度检测\n- **会话隔离**：每个测试用例独立浏览器会话\n\n### 3. 迭代计划\n**MVP（迭代 1）**：5-7 天\n- 基础设施（界面、LLM 配置）\n- 单测试用例执行\n- PRD 生成用例\n- 基础文档\n\n**迭代 2**：2-3 天\n- 智能页面遍历工具\n- 页面树生成\n- 功能清单提取\n\n**迭代 3**：3-5 天\n- 基于页面树的智能测试\n- 批量测试执行\n- 完整测试报告\n\n**迭代 4**：2-3 天\n- 性能优化（MCP 缓存）\n- Prompt 优化\n- 测试历史记录\n\n### 4. MVP 详细实施方案\n**阶段 1**：项目基础配置、界面中文化、LLM 简化（1-2天）\n**阶段 2**：业务交互层、测试用例管理、PRD 处理（3-4天）\n**阶段 3**：文档和集成（1天）\n\n## 📝 具体执行步骤\n\n### 步骤 1：创建 web_auto_use.md\n- 包含完整的产品设计文档\n- 包含技术架构图\n- 包含两阶段工作流程图\n- 包含无限循环检测算法\n- 包含详细的迭代计划\n- 包含 MVP 任务清单\n\n### 步骤 2：文档结构\n```\n# 浏览器 AI 自动化测试平台设计方案\n\n## 1. 产品愿景\n## 2. 核心理念\n## 3. 产品最终形态（两阶段）\n## 4. 技术挑战与解决方案\n## 5. 迭代路线图\n## 6. MVP 详细方案\n## 7. 未来展望\n```\n\n## ✅ 验收标准\n\n- [x] 文档清晰描述产品愿景\n- [x] 两阶段设计有完整流程图和算法\n- [x] 无限循环检测方案明确\n- [x] 迭代计划时间估算合理\n- [x] MVP 方案可直接执行\n\n准备创建文档到项目根目录：`/Users/sunshunda/Desktop/browser_use/auto_test_by_sunshunda/web_auto_use.md`"
}
```

```markdown
✅ 文档创建完成！

我已经成功创建了 web_auto_use.md 完整产品设计文档，位于项目根目录。

📋 文档内容总览

1. 产品愿景（第 1-2 节）

问题陈述：传统 UI 测试的痛点
产品定位：AI 驱动的浏览器自动化测试平台
核心价值主张："让 AI 像人一样理解和测试你的系统"
核心理念：AI-First 设计、两阶段工作模式
2. 产品最终形态（第 3 节）

完整工作流程图：
阶段 A：智能探索（AI 自动遍历系统）
阶段 B：智能测试（基于页面树执行测试）
4 大关键特性：
智能页面遍历
功能清单自动提取
基于页面树的智能测试
无限循环检测
3. 技术挑战与解决方案（第 4 节）

挑战 1：无限循环检测

完整的 LoopDetector 类实现
URL 规范化、分页识别、模式检测
代码示例和使用方法
挑战 2：测试用例隔离

独立浏览器会话 + 异常隔离
TestCaseExecutor 类实现
批量测试支持
挑战 3：测试断言设计

LLM 辅助验证 + 结构化断言
AssertionVerifier 类实现
混合验证模式
4. 迭代路线图（第 5 节）

完整的 4 个迭代计划：

迭代 1（MVP）     迭代 2           迭代 3           迭代 4
5-7 天           2-3 天           3-5 天           2-3 天
─────────────────────────────────────────────────────────
基础能力         智能探索         高级测试         优化完善
- 界面中文化     - 页面遍历       - 页面树测试     - MCP 缓存
- LLM 配置      - 功能清单       - 批量执行       - Prompt 优化
- 单用例执行     - 循环检测       - 完整报告       - 测试历史
- PRD 生成      - 可视化         - 并行测试       - 性能优化
5. MVP 详细方案（第 6 节）

这是文档的核心部分，包含：

6.1 MVP 目标

可演示、可用的基础平台
支持单测试用例执行
支持 PRD 生成用例
6.2 MVP 范围

✅ 包含的功能（详细列表）
❌ 不包含的功能（后续迭代）
6.3 MVP 架构

五层架构图
数据流图
6.4 MVP 实施计划

分为 3 个阶段，每个阶段都有：

详细任务清单
实现步骤
验收标准
阶段 1：基础设施（1-2 天）

项目配置
界面中文化
LLM 简化
阶段 2：核心功能（3-4 天）

业务交互层
测试用例管理 UI
PRD 处理 UI
阶段 3：文档和集成（1 天）

操作说明
最终集成
端到端测试
6.5 关键技术细节

测试用例模板（完整示例）
3 个简化版 Prompt 模板：
测试用例转指令
预期结果验证
PRD 生成测试用例
6.6 MVP 时间估算

详细的时间分配表

6.7 MVP 验收标准

功能验收（11 项检查）
质量验收（7 项检查）
演示验收（3 个演示场景）
6. 未来展望（第 7 节）

短期/中期/长期目标
技术演进方向
潜在应用场景
🎯 文档特点

完整性 ✅

从产品愿景到实施细节，一应俱全
涵盖所有技术挑战和解决方案
包含完整的代码示例
可执行性 ✅

MVP 方案可直接按照执行
每个阶段都有明确的任务清单
时间估算合理
前瞻性 ✅

设计考虑了未来 4 个迭代
技术方案可扩展
为高级功能预留接口
专业性 ✅

完整的架构设计
详细的技术方案
代码示例可直接使用
📌 下一步建议

现在文档已经完成，你可以：

选项 A：开始实施 MVP

按照文档第 6.4 节的实施计划
从阶段 1 开始逐步执行
每完成一个阶段进行验收
选项 B：进一步完善文档

补充更多代码示例
添加更详细的错误处理方案
补充性能指标
选项 C：评审和讨论

与团队成员一起评审文档
讨论技术方案的可行性
调整时间估算
你希望现在开始实施 MVP，还是需要对文档进行调整？
```

```markdown
Todo List
任务 1.1：项目基础配置（.env配置、目录结构、测试样例）
任务 2.1：界面中文化（所有UI组件翻译为中文）
任务 2.2：品牌定制（蓝色主题#005BF5 + Logo展示 + 版权信息）
任务 3.1：简化LLM配置（仅保留SiliconFlow和DeepSeek）
任务 4.1：测试用例模板设计（创建标准Markdown模板）
任务 4.2：测试用例上传与解析（UI + 解析逻辑）
任务 4.3：单个测试用例执行（转换为自然语言指令并执行）
任务 5.1：基础PRD处理（上传、解析、简单验证）
任务 5.2：PRD转测试用例（简化版，使用LLM生成）
任务 6.1：操作说明文档（编写user_guide.md并展示）
Tokens: 9 in, 1442 out
```

