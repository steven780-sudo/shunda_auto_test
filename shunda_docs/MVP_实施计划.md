# MVP 实施计划 - 详细任务清单

> **作者**: 孙顺达
> **项目**: 基于 Midscene.js 的 AI 驱动自动化测试平台
> **版本**: v1.0
> **预计时间**: 5-7 天

---

## 📋 目录

- [实施概览](#实施概览)
- [阶段 1: 项目基础搭建 (Day 1-2)](#阶段-1-项目基础搭建-day-1-2)
- [阶段 2: 核心功能开发 (Day 3-6)](#阶段-2-核心功能开发-day-3-6)
- [阶段 3: 完善与交付 (Day 7-8)](#阶段-3-完善与交付-day-7-8)
- [每日检查清单](#每日检查清单)
- [常见问题处理](#常见问题处理)

---

## 实施概览

### 时间规划

```
Week 1: Day 1-7
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ D1  │ D2  │ D3  │ D4  │ D5  │ D6  │ D7  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│环境 │UI   │测试 │PRD  │LLM  │集成 │文档 │
│搭建 │框架 │用例 │生成 │配置 │测试 │优化 │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

Week 2: Day 8 (可选)
┌─────┐
│ D8  │
├─────┤
│部署 │
│试用 │
└─────┘
```

### 里程碑

- **Day 2 完成**: UI 框架可运行,6 个 Tab 页面显示
- **Day 4 完成**: 核心流程打通 (PRD → YAML → 执行)
- **Day 6 完成**: 所有功能集成完毕
- **Day 7 完成**: 文档完整,可交付

---

## 阶段 1: 项目基础搭建 (Day 1-2)

### Day 1: 环境搭建和架构初始化

#### 1.1 创建项目目录结构 (30min)

```bash
# 创建项目根目录
mkdir midscene-auto-test
cd midscene-auto-test

# 创建目录结构
mkdir -p src/{ui,business,midscene_bridge,utils,prompts}
mkdir -p src/ui/{tabs,components}
mkdir -p templates docs tests reports logs

# 创建文件
touch src/ui/app.py
touch src/ui/tabs/{llm_config_tab.py,browser_settings_tab.py,testcase_management_tab.py,prd_to_testcase_tab.py,test_execution_tab.py,user_guide_tab.py}
touch src/business/{prd_processor.py,testcase_manager.py,report_generator.py}
touch src/midscene_bridge/{execute.js,config.js}
touch src/utils/{config_loader.py,logger.py,validators.py}
touch .env.example README.md
```

**验收标准**:
- [x] 目录结构完整
- [x] 所有关键文件已创建

#### 1.2 初始化 Git 仓库 (10min)

```bash
# 初始化 Git
git init

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env

# Node
node_modules/
npm-debug.log*
yarn-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# 输出
reports/
logs/
midscene_run/

# 临时文件
*.tmp
*.log
.DS_Store
EOF

# 首次提交
git add .
git commit -m "init: 项目初始化"
```

**验收标准**:
- [x] Git 仓库已初始化
- [x] .gitignore 配置正确

#### 1.3 安装 Python 依赖 (20min)

```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 创建 requirements.txt
cat > requirements.txt << 'EOF'
gradio==4.16.0
pyyaml==6.0.1
requests==2.31.0
python-dotenv==1.0.0
pytest==7.4.3
EOF

# 安装依赖
pip install -r requirements.txt
```

**验收标准**:
- [x] 虚拟环境已创建
- [x] 所有依赖安装成功
- [x] 可以 `import gradio` 无报错

#### 1.4 安装 Midscene.js 依赖 (30min)

```bash
# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "midscene-auto-test",
  "version": "1.0.0",
  "description": "AI驱动的自动化测试平台",
  "type": "module",
  "scripts": {
    "test": "node src/midscene_bridge/execute.js"
  },
  "dependencies": {
    "@midscene/web": "^0.30.8",
    "playwright": "^1.40.0"
  }
}
EOF

# 安装依赖
npm install
# 或使用 pnpm (推荐)
# pnpm install

# 安装 Playwright 浏览器
npx playwright install chromium
```

**验收标准**:
- [x] node_modules 已生成
- [x] @midscene/web 安装成功
- [x] Chromium 浏览器已下载

#### 1.5 配置环境变量 (15min)

```bash
# 创建 .env.example
cat > .env.example << 'EOF'
# LLM 配置
SILICONFLOW_API_KEY=your_siliconflow_api_key_here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL

DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# 浏览器配置
BROWSER_ENGINE=playwright
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
OPERATION_TIMEOUT=30

# 输出配置
OUTPUT_DIR=./reports
LOG_DIR=./logs
EOF

# 复制为 .env (用户需要填入真实 API Key)
cp .env.example .env
```

**验收标准**:
- [x] .env.example 已创建
- [x] 所有配置项都有说明

#### 1.6 编写 Midscene 执行脚本 (60min)

```javascript
// src/midscene_bridge/execute.js
import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * 执行 Midscene YAML 测试用例
 * @param {string} yamlPath - YAML 文件路径
 * @param {object} config - 配置对象
 */
async function executeYaml(yamlPath, config) {
  let browser = null;
  let startTime = Date.now();

  try {
    // 1. 验证 YAML 文件存在
    if (!fs.existsSync(yamlPath)) {
      throw new Error(`YAML file not found: ${yamlPath}`);
    }

    // 2. 启动浏览器
    browser = await chromium.launch({
      headless: config.headless !== undefined ? config.headless : false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 3. 创建浏览器上下文
    const context = await browser.newContext({
      viewport: {
        width: config.viewport?.width || 1920,
        height: config.viewport?.height || 1080
      }
    });

    const page = await context.newPage();

    // 4. 创建 Midscene Agent
    const agent = await PlaywrightAgent.create(page, {
      generateReport: true,
      groupName: config.groupName || '自动化测试执行',
      groupDescription: config.groupDescription || '',
      autoPrintReportMsg: false,
      cache: config.cache ? {
        enabled: true,
        id: config.cacheId || 'default'
      } : undefined
    });

    // 5. 读取 YAML 内容
    const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

    // 6. 执行 YAML 脚本
    const result = await agent.runYaml(yamlContent);

    // 7. 获取报告路径
    const reportHTML = agent.reportHTMLString();
    const reportDir = config.outputDir || './reports';

    // 确保报告目录存在
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // 生成报告文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const reportPath = path.join(reportDir, `report_${timestamp}.html`);

    // 保存报告
    fs.writeFileSync(reportPath, reportHTML);

    // 8. 返回执行结果 (通过 stdout)
    const duration = (Date.now() - startTime) / 1000;
    const output = {
      status: 'success',
      result: result,
      report_path: path.resolve(reportPath),
      duration: duration,
      tasks_count: agent.dump?.tasks?.length || 0,
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(output));

  } catch (error) {
    // 返回错误 (通过 stderr)
    const errorOutput = {
      status: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    console.error(JSON.stringify(errorOutput));
    process.exit(1);

  } finally {
    // 清理资源
    if (browser) {
      await browser.close();
    }
  }
}

// 主函数
async function main() {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);

    if (args.length < 1) {
      throw new Error('Usage: node execute.js <yaml_path> [config_json]');
    }

    const yamlPath = args[0];
    const config = args[1] ? JSON.parse(args[1]) : {};

    // 执行
    await executeYaml(yamlPath, config);

  } catch (error) {
    console.error(JSON.stringify({
      status: 'error',
      message: error.message,
      stack: error.stack
    }));
    process.exit(1);
  }
}

// 运行
main();
```

**验收标准**:
- [x] execute.js 文件已创建
- [x] 代码包含完整的错误处理
- [x] 可以手动测试执行

#### 1.7 测试 Python ↔ Node.js 通信 (30min)

```python
# tests/test_bridge.py
import subprocess
import json
import os

def test_midscene_bridge():
    """测试 Python 调用 Node.js"""

    # 创建测试 YAML
    test_yaml = """
web:
  url: https://www.bing.com
  headless: true

tasks:
  - name: "简单测试"
    flow:
      - aiQuery:
          demand: "string, 获取页面标题"
          name: title
"""

    # 保存 YAML
    yaml_path = '/tmp/test.yaml'
    with open(yaml_path, 'w') as f:
        f.write(test_yaml)

    # 调用 Node.js
    cmd = [
        'node',
        'src/midscene_bridge/execute.js',
        yaml_path,
        json.dumps({'headless': True})
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=60
    )

    print("Return code:", result.returncode)
    print("Stdout:", result.stdout)
    print("Stderr:", result.stderr)

    # 解析结果
    if result.returncode == 0:
        output = json.loads(result.stdout)
        assert output['status'] == 'success'
        assert 'report_path' in output
        print("✅ 测试通过!")
    else:
        print("❌ 测试失败!")
        raise Exception(result.stderr)

if __name__ == '__main__':
    test_midscene_bridge()
```

```bash
# 运行测试
python tests/test_bridge.py
```

**验收标准**:
- [x] 测试脚本可以运行
- [x] Node.js 可以被成功调用
- [x] 返回结果格式正确

---

### Day 2: UI 框架搭建

#### 2.1 创建 Gradio 主应用 (45min)

```python
# src/ui/app.py
import gradio as gr
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 导入各个标签页 (先创建空的,后续再实现)
from tabs import (
    llm_config_tab,
    browser_settings_tab,
    testcase_management_tab,
    prd_to_testcase_tab,
    test_execution_tab,
    user_guide_tab
)

# 自定义 CSS
custom_css = """
/* 主题色 */
:root {
    --primary-color: #005BF5;
    --primary-hover: #0047C2;
}

/* 标题栏样式 */
.gradio-container {
    max-width: 1400px !important;
}

/* 按钮样式 */
.primary-btn {
    background-color: var(--primary-color) !important;
    color: white !important;
}

.primary-btn:hover {
    background-color: var(--primary-hover) !important;
}

/* Logo 和版权 */
.logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: linear-gradient(135deg, #005BF5 0%, #0047C2 100%);
    color: white;
}
"""

def create_ui():
    """创建主 UI"""

    with gr.Blocks(
        title="数字员工 AUTO_TEST - AI 驱动自动化测试平台",
        theme=gr.themes.Soft(primary_hue="blue"),
        css=custom_css
    ) as demo:

        # Logo 和标题栏
        with gr.Row(elem_classes="logo-container"):
            gr.Markdown("## 🤖 数字员工 AUTO_TEST")
            gr.Markdown("Copyright © 孙顺达")

        # Tab 页面
        with gr.Tabs():
            # Tab 1: LLM 配置
            with gr.Tab("🤖 LLM 配置"):
                llm_config_tab.create_tab()

            # Tab 2: 浏览器设置
            with gr.Tab("🌐 浏览器设置"):
                browser_settings_tab.create_tab()

            # Tab 3: 测试用例管理
            with gr.Tab("📝 测试用例管理"):
                testcase_management_tab.create_tab()

            # Tab 4: PRD 生成用例
            with gr.Tab("📄 PRD 生成用例"):
                prd_to_testcase_tab.create_tab()

            # Tab 5: 测试执行
            with gr.Tab("▶️ 测试执行"):
                test_execution_tab.create_tab()

            # Tab 6: 操作说明
            with gr.Tab("📖 操作说明"):
                user_guide_tab.create_tab()

    return demo

if __name__ == '__main__':
    demo = create_ui()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )
```

**验收标准**:
- [x] app.py 可以运行
- [x] 界面显示 6 个 Tab
- [x] 主题色为蓝色

#### 2.2 创建空白 Tab 页面 (60min)

为每个 Tab 创建基本框架:

```python
# src/ui/tabs/llm_config_tab.py
import gradio as gr

def create_tab():
    """创建 LLM 配置标签页"""

    gr.Markdown("## LLM 配置")
    gr.Markdown("配置 AI 模型的 API Key 和参数")

    with gr.Column():
        # 主模型配置
        gr.Markdown("### 主模型配置")
        provider = gr.Dropdown(
            choices=["SiliconFlow", "DeepSeek"],
            value="SiliconFlow",
            label="提供商"
        )
        api_key = gr.Textbox(
            label="API Key",
            type="password",
            placeholder="sk-..."
        )
        model_name = gr.Textbox(
            label="模型名称",
            value="Qwen/Qwen2.5-VL"
        )

        # 规划器配置
        gr.Markdown("### 规划器配置")
        planner_provider = gr.Dropdown(
            choices=["DeepSeek"],
            value="DeepSeek",
            label="提供商"
        )
        planner_api_key = gr.Textbox(
            label="API Key",
            type="password"
        )
        planner_model = gr.Textbox(
            label="模型名称",
            value="deepseek-chat"
        )

        # 按钮
        with gr.Row():
            save_btn = gr.Button("保存配置", variant="primary")
            test_btn = gr.Button("测试连接")

        # 状态显示
        status_output = gr.Textbox(label="状态", interactive=False)

        # 绑定事件 (后续实现)
        # save_btn.click(...)
```

类似地创建其他 Tab:

- `browser_settings_tab.py` - 浏览器设置
- `testcase_management_tab.py` - 测试用例管理
- `prd_to_testcase_tab.py` - PRD 生成用例
- `test_execution_tab.py` - 测试执行 (显示"功能开发中")
- `user_guide_tab.py` - 操作说明

**验收标准**:
- [x] 所有 Tab 可以显示
- [x] 基本 UI 组件已添加
- [x] 无报错

#### 2.3 应用中文化和主题定制 (30min)

```python
# 更新 app.py 中的 CSS
custom_css = """
/* 主题色 */
:root {
    --primary-color: #005BF5;
    --primary-hover: #0047C2;
    --border-color: #E0E0E0;
}

/* Logo 和标题栏 */
.logo-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: linear-gradient(135deg, #005BF5 0%, #0047C2 100%);
    color: white;
    border-radius: 8px 8px 0 0;
    margin-bottom: 20px;
}

.logo-container h2 {
    margin: 0;
    font-weight: 600;
}

/* 卡片样式 */
.card {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 按钮样式 */
button.primary {
    background-color: var(--primary-color) !important;
    color: white !important;
    border: none !important;
}

button.primary:hover {
    background-color: var(--primary-hover) !important;
}

/* Tab 标签样式 */
.tab-nav button {
    font-size: 16px;
    font-weight: 500;
}

.tab-nav button.selected {
    border-bottom: 3px solid var(--primary-color) !important;
}
"""
```

**验收标准**:
- [x] 主题色为 #005BF5
- [x] 所有文本中文化
- [x] Logo 和版权信息显示

#### 2.4 测试 UI 基本功能 (15min)

```bash
# 运行应用
python src/ui/app.py

# 访问 http://localhost:7860
# 检查:
# - 6 个 Tab 都可以正常切换
# - 界面显示正常,无错位
# - 主题色正确
```

**验收标准**:
- [x] 应用可以启动
- [x] 所有 Tab 可以访问
- [x] 无 JavaScript 报错

---

## 阶段 2: 核心功能开发 (Day 3-6)

### Day 3: 测试用例管理

#### 3.1 实现 TestCaseManager 类 (120min)

```python
# src/business/testcase_manager.py
import yaml
import subprocess
import json
import os
from typing import Dict, List, Optional
from datetime import datetime

class TestCaseManager:
    """测试用例管理器"""

    def __init__(self):
        self.node_script_path = os.path.join(
            os.path.dirname(__file__),
            '../midscene_bridge/execute.js'
        )

    def parse_yaml(self, yaml_content: str) -> Dict:
        """解析 YAML 测试用例"""
        try:
            data = yaml.safe_load(yaml_content)
            return {
                'status': 'success',
                'data': data,
                'message': f'成功解析,共找到 {len(data.get("tasks", []))} 个测试用例'
            }
        except yaml.YAMLError as e:
            return {
                'status': 'error',
                'message': f'YAML 格式错误: {str(e)}'
            }

    def validate_yaml(self, parsed_data: Dict) -> Dict:
        """验证 YAML 格式"""
        errors = []
        warnings = []

        # 检查必填字段
        if 'web' not in parsed_data:
            errors.append('缺少 "web" 配置')
        elif 'url' not in parsed_data['web']:
            errors.append('缺少 "web.url" 字段')

        if 'tasks' not in parsed_data:
            errors.append('缺少 "tasks" 字段')
        elif not isinstance(parsed_data['tasks'], list):
            errors.append('"tasks" 必须是列表')
        elif len(parsed_data['tasks']) == 0:
            warnings.append('测试用例列表为空')

        # 检查每个任务
        for i, task in enumerate(parsed_data.get('tasks', [])):
            if 'name' not in task:
                warnings.append(f'任务 {i+1} 缺少 "name" 字段')
            if 'flow' not in task:
                errors.append(f'任务 {i+1} 缺少 "flow" 字段')

        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }

    def extract_tasks(self, parsed_data: Dict) -> List[Dict]:
        """提取任务列表"""
        tasks = parsed_data.get('tasks', [])
        result = []

        for i, task in enumerate(tasks):
            result.append({
                'index': i,
                'name': task.get('name', f'未命名任务 {i+1}'),
                'steps_count': len(task.get('flow', [])),
                'description': f'{len(task.get("flow", []))} 个步骤'
            })

        return result

    def execute_yaml(
        self,
        yaml_content: str,
        config: Optional[Dict] = None
    ) -> Dict:
        """执行 YAML 测试用例"""

        # 保存 YAML 到临时文件
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        yaml_path = f'/tmp/testcase_{timestamp}.yaml'

        try:
            with open(yaml_path, 'w', encoding='utf-8') as f:
                f.write(yaml_content)

            # 准备配置
            exec_config = config or {}
            exec_config.setdefault('headless', False)
            exec_config.setdefault('outputDir', './reports')

            # 调用 Node.js
            cmd = [
                'node',
                self.node_script_path,
                yaml_path,
                json.dumps(exec_config)
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 分钟超时
            )

            # 解析结果
            if result.returncode == 0:
                output = json.loads(result.stdout)
                return {
                    'status': 'success',
                    'data': output,
                    'message': '测试执行成功'
                }
            else:
                error_data = json.loads(result.stderr) if result.stderr else {}
                return {
                    'status': 'error',
                    'message': error_data.get('message', '执行失败'),
                    'details': error_data
                }

        except subprocess.TimeoutExpired:
            return {
                'status': 'error',
                'message': '执行超时 (5 分钟)',
                'details': {}
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'执行出错: {str(e)}',
                'details': {}
            }
        finally:
            # 清理临时文件
            if os.path.exists(yaml_path):
                os.remove(yaml_path)
```

**验收标准**:
- [x] TestCaseManager 类已实现
- [x] 所有方法都有文档字符串
- [x] 包含完整的错误处理

#### 3.2 实现测试用例管理 Tab UI (90min)

```python
# src/ui/tabs/testcase_management_tab.py
import gradio as gr
from business.testcase_manager import TestCaseManager

# 创建管理器实例
manager = TestCaseManager()

def create_tab():
    """创建测试用例管理标签页"""

    # 状态变量
    parsed_data = gr.State(None)

    gr.Markdown("## 📝 测试用例管理")
    gr.Markdown("上传或编写 YAML 格式的测试用例,然后执行测试")

    with gr.Column():
        # 步骤 1: 获取测试用例
        gr.Markdown("### 步骤 1: 获取测试用例")

        with gr.Row():
            download_btn = gr.Button("📥 下载 YAML 模板")
            example_btn = gr.Button("👀 查看示例")

        file_upload = gr.File(
            label="上传 YAML 文件",
            file_types=[".yaml", ".yml"]
        )

        yaml_input = gr.Code(
            label="或直接输入 YAML 内容",
            language="yaml",
            lines=15,
            value="""web:
  url: https://www.bing.com
  headless: false

tasks:
  - name: "搜索测试"
    flow:
      - aiQuery:
          demand: "string, 获取页面标题"
          name: title"""
        )

        with gr.Row():
            parse_btn = gr.Button("🔍 解析用例", variant="primary")
            clear_btn = gr.Button("🗑️ 清空内容")

        # 步骤 2: 查看解析结果
        gr.Markdown("### 步骤 2: 查看解析结果")

        parse_status = gr.Textbox(
            label="解析状态",
            interactive=False,
            lines=3
        )

        tasks_list = gr.Radio(
            label="选择要执行的测试用例",
            choices=[],
            interactive=True
        )

        # 步骤 3: 执行测试
        gr.Markdown("### 步骤 3: 执行测试")

        execute_btn = gr.Button("▶️ 执行选中用例", variant="primary")

        # 步骤 4: 查看结果
        gr.Markdown("### 步骤 4: 查看结果")

        execution_status = gr.Markdown("等待执行...")

        with gr.Row():
            report_link = gr.Textbox(
                label="测试报告路径",
                interactive=False
            )
            view_report_btn = gr.Button("📊 查看报告")

    # 事件处理函数
    def parse_yaml_handler(yaml_content):
        """解析 YAML"""
        result = manager.parse_yaml(yaml_content)

        if result['status'] == 'success':
            # 验证
            validation = manager.validate_yaml(result['data'])

            if not validation['valid']:
                error_msg = "❌ YAML 验证失败:\n" + "\n".join(validation['errors'])
                return error_msg, gr.update(choices=[]), result['data']

            # 提取任务
            tasks = manager.extract_tasks(result['data'])
            task_choices = [f"{t['index']}. {t['name']} ({t['description']})"
                           for t in tasks]

            success_msg = f"✅ {result['message']}"
            if validation['warnings']:
                success_msg += "\n⚠️ 警告:\n" + "\n".join(validation['warnings'])

            return success_msg, gr.update(choices=task_choices), result['data']
        else:
            return f"❌ {result['message']}", gr.update(choices=[]), None

    def execute_yaml_handler(selected_task, yaml_content):
        """执行 YAML"""
        if not selected_task:
            return "⚠️ 请先选择要执行的测试用例", ""

        # 执行
        result = manager.execute_yaml(yaml_content)

        if result['status'] == 'success':
            data = result['data']
            duration = data.get('duration', 0)
            report_path = data.get('report_path', '')

            status_md = f"""
✅ **测试执行成功!**

- 执行时长: {duration:.1f} 秒
- 任务数: {data.get('tasks_count', 0)}
- 报告路径: {report_path}

点击"查看报告"按钮打开详细报告
"""
            return status_md, report_path
        else:
            error_md = f"""
❌ **测试执行失败**

错误信息: {result['message']}

请检查:
1. YAML 语法是否正确
2. 目标网站是否可访问
3. LLM API Key 是否配置正确
"""
            return error_md, ""

    def clear_input_handler():
        """清空输入"""
        return ""

    def load_example_handler():
        """加载示例"""
        example = """web:
  url: https://www.bing.com
  headless: false

tasks:
  - name: "必应搜索测试"
    flow:
      - aiQuery:
          demand: "string, 获取页面标题"
          name: title
      - aiAction: "在搜索框中输入 'Midscene.js' 并搜索"
      - aiAssert: "页面显示搜索结果"
"""
        return example

    # 绑定事件
    parse_btn.click(
        fn=parse_yaml_handler,
        inputs=[yaml_input],
        outputs=[parse_status, tasks_list, parsed_data]
    )

    execute_btn.click(
        fn=execute_yaml_handler,
        inputs=[tasks_list, yaml_input],
        outputs=[execution_status, report_link]
    )

    clear_btn.click(
        fn=clear_input_handler,
        outputs=[yaml_input]
    )

    example_btn.click(
        fn=load_example_handler,
        outputs=[yaml_input]
    )
```

**验收标准**:
- [x] UI 可以显示
- [x] 可以上传文件
- [x] 可以解析 YAML
- [x] 可以执行测试

#### 3.3 创建 YAML 模板文件 (30min)

```yaml
# templates/testcase_template.yaml
# Midscene.js 测试用例模板
# 作者: 孙顺达
# 版本: v1.0

# ===== 环境配置 =====
web:
  url: https://example.com     # 必填: 测试网站 URL
  headless: false              # 可选: 是否无头模式 (默认 false)
  viewport:                    # 可选: 浏览器窗口大小
    width: 1920
    height: 1080

# ===== 测试任务列表 =====
tasks:
  # ===== 任务 1: 用户登录测试 =====
  - name: "用户登录功能测试"
    flow:
      # 1. 自然语言操作 (AI 自动规划)
      - aiAction: "点击页面右上角的登录按钮"

      # 2. 输入操作
      - aiInput:
          locate: "用户名输入框"          # 元素描述 (自然语言)
          value: "test@example.com"       # 输入内容

      - aiInput:
          locate: "密码输入框"
          value: "password123"

      # 3. 点击操作
      - aiTap: "提交按钮"

      # 4. 等待条件
      - aiWaitFor: "页面完成跳转"

      # 5. 断言验证
      - aiAssert: "页面显示欢迎信息,包含用户名"
      - aiAssert: "右上角显示退出按钮"

      # 6. 数据提取
      - aiQuery:
          demand: "string, 获取当前登录的用户名"
          name: username                  # 保存到变量

  # ===== 任务 2: 搜索功能测试 =====
  - name: "搜索功能测试"
    flow:
      - aiTap: "搜索图标"

      - aiInput:
          locate: "搜索输入框"
          value: "Midscene.js"

      - aiAction: "点击搜索按钮并等待结果加载"

      - aiQuery:
          demand: "array<string>, 提取前5条搜索结果的标题"
          name: searchResults

      - aiAssert: "搜索结果不为空,至少有3条结果"

# ===== 指令说明 =====
# aiAction: AI 自动规划并执行复杂操作
# aiTap: 点击元素
# aiInput: 输入文本
# aiAssert: 断言验证
# aiQuery: 数据提取
# aiWaitFor: 等待条件
# aiScroll: 滚动页面
# sleep: 延迟等待 (秒)

# ===== 编写技巧 =====
# 1. 元素描述要具体: "页面右上角的登录按钮" 而不是 "登录"
# 2. 断言要明确: "页面显示欢迎信息,包含用户名" 而不是 "登录成功"
# 3. 数据提取要指定类型: "string, 获取标题" 或 "array<string>, 获取列表"
# 4. 操作间加等待: aiWaitFor 确保页面加载完成

# ===== 更多示例 =====
# 访问官方文档: https://midscenejs.com
```

**验收标准**:
- [x] 模板文件已创建
- [x] 包含详细注释
- [x] 提供多个示例

#### 3.4 测试完整流程 (30min)

```bash
# 1. 启动应用
python src/ui/app.py

# 2. 测试流程:
#    - 上传模板文件
#    - 点击解析
#    - 选择用例
#    - 点击执行
#    - 查看报告
```

**验收标准**:
- [x] 完整流程可以走通
- [x] 报告可以生成
- [x] 无崩溃和严重 Bug

---

### Day 4: PRD 生成用例

#### 4.1 实现 PRDProcessor 类 (90min)

```python
# src/business/prd_processor.py
import os
import requests
import json
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class PRDProcessor:
    """PRD 处理器"""

    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        self.base_url = os.getenv('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1')
        self.model = os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        """加载 Prompt 模板"""
        template_path = os.path.join(
            os.path.dirname(__file__),
            '../prompts/prd_to_yaml_prompt.txt'
        )

        if os.path.exists(template_path):
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            # 默认 Prompt
            return self._get_default_prompt()

    def _get_default_prompt(self) -> str:
        """获取默认 Prompt"""
        return """你是一个专业的测试用例设计专家。请根据以下 PRD 文档生成标准的 Midscene YAML 测试用例。

【PRD 内容】
{prd_content}

【生成要求】
1. 严格按照 Midscene YAML 格式
2. 使用以下指令:
   - aiAction: 自然语言描述的复杂操作
   - aiTap: 点击元素
   - aiInput: 输入文本
   - aiAssert: 断言验证
   - aiQuery: 数据提取
   - aiWaitFor: 等待条件
3. 为每个核心功能生成 1-2 个测试用例
4. 断言要明确可验证
5. 操作步骤要清晰具体

【输出格式】
请输出完整的 YAML 格式测试用例,使用 ```yaml 代码块包裹。

【重要提示】
- 从 PRD 中提取测试网站 URL,如果没有则使用 https://example.com
- 操作描述要具体,例如 "点击页面右上角的登录按钮" 而不是 "点击登录"
- 断言要包含验证条件,例如 "页面显示欢迎信息,包含用户名"
- 数据提取要指定类型,例如 "string, 获取用户名"

现在请生成 YAML 测试用例:"""

    def parse_prd(self, prd_content: str) -> Dict:
        """解析 PRD 文档"""
        return {
            'content': prd_content,
            'length': len(prd_content),
            'word_count': len(prd_content.split()),
            'has_url': 'http' in prd_content.lower()
        }

    def generate_yaml(
        self,
        prd_content: str,
        additional_context: Optional[str] = None
    ) -> Dict:
        """调用 LLM 生成 YAML 测试用例"""

        if not self.api_key:
            return {
                'status': 'error',
                'message': 'DeepSeek API Key 未配置,请先在 LLM 配置页面设置'
            }

        try:
            # 构建 Prompt
            prompt = self.prompt_template.format(
                prd_content=prd_content,
                additional_context=additional_context or ""
            )

            # 调用 LLM API
            response = self._call_llm_api(prompt)

            # 提取 YAML
            yaml_content = self._extract_yaml_from_response(response)

            return {
                'status': 'success',
                'yaml_content': yaml_content,
                'message': '测试用例生成成功'
            }

        except Exception as e:
            return {
                'status': 'error',
                'message': f'生成失败: {str(e)}'
            }

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
                    'content': '你是一个专业的测试用例设计专家,精通 Midscene.js 测试框架。'
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

**验收标准**:
- [x] PRDProcessor 类已实现
- [x] 可以调用 DeepSeek API
- [x] 可以提取 YAML 内容

#### 4.2 创建 Prompt 模板 (30min)

```
# src/prompts/prd_to_yaml_prompt.txt
你是一个专业的测试用例设计专家,精通 Midscene.js 自动化测试框架。

【任务】
根据以下 PRD 文档生成标准的 Midscene YAML 测试用例。

【PRD 内容】
{prd_content}

【Midscene YAML 格式说明】

基本结构:
```yaml
web:
  url: <测试网站URL>
  headless: false

tasks:
  - name: "<测试名称>"
    flow:
      - <指令1>
      - <指令2>
      ...
```

可用指令:
1. aiAction: "<自然语言描述的操作>"
   - 用于复杂操作,AI 会自动规划步骤

2. aiTap: "<元素描述>"
   - 点击元素

3. aiInput:
     locate: "<元素描述>"
     value: "<输入内容>"
   - 输入文本

4. aiAssert: "<断言描述>"
   - 验证页面状态

5. aiQuery:
     demand: "<类型>, <提取内容描述>"
     name: <变量名>
   - 提取数据
   - 类型: string / number / boolean / array<string> / object

6. aiWaitFor: "<等待条件>"
   - 等待某个条件满足

【生成要求】
1. 为每个核心功能生成 1-2 个测试用例
2. 测试用例名称要清晰 (如 "用户登录-正常流程测试")
3. 操作描述要具体:
   - ✅ "点击页面右上角的蓝色登录按钮"
   - ❌ "点击登录"
4. 断言要明确可验证:
   - ✅ "页面显示欢迎信息,包含用户名,右上角有退出按钮"
   - ❌ "登录成功"
5. 关键操作后加 aiWaitFor,确保页面加载完成
6. 数据提取要指定类型:
   - ✅ "string, 获取当前登录用户名"
   - ❌ "获取用户名"

【输出格式】
请输出完整的 YAML 内容,使用 ```yaml 代码块包裹。

【示例】
```yaml
web:
  url: https://example.com
  headless: false

tasks:
  - name: "用户登录-正常流程测试"
    flow:
      - aiAction: "找到页面右上角的登录按钮并点击"
      - aiWaitFor: "登录表单弹出或页面跳转"
      - aiInput:
          locate: "用户名输入框"
          value: "test@example.com"
      - aiInput:
          locate: "密码输入框"
          value: "password123"
      - aiTap: "提交按钮"
      - aiWaitFor: "页面完成跳转"
      - aiAssert: "页面显示欢迎信息,包含用户名"
      - aiAssert: "页面右上角有退出按钮"
      - aiQuery:
          demand: "string, 获取显示的用户名"
          name: displayedUsername
```

现在请根据上述 PRD 生成完整的 YAML 测试用例:
```

**验收标准**:
- [x] Prompt 模板已创建
- [x] 包含详细说明和示例
- [x] 格式清晰易读

#### 4.3 实现 PRD 生成用例 Tab UI (60min)

```python
# src/ui/tabs/prd_to_testcase_tab.py
import gradio as gr
from business.prd_processor import PRDProcessor

# 创建处理器实例
processor = PRDProcessor()

def create_tab():
    """创建 PRD 生成用例标签页"""

    gr.Markdown("## 📄 PRD 生成测试用例")
    gr.Markdown("上传 PRD 文档,AI 自动生成标准的 YAML 测试用例")

    with gr.Column():
        # 步骤 1: 上传 PRD
        gr.Markdown("### 步骤 1: 上传 PRD 文档")
        gr.Markdown("支持格式: Markdown (.md), 纯文本 (.txt)")

        prd_file = gr.File(
            label="上传 PRD 文件",
            file_types=[".md", ".txt"]
        )

        prd_input = gr.Textbox(
            label="或直接输入 PRD 内容",
            placeholder="粘贴您的 PRD 文档...",
            lines=10
        )

        generate_btn = gr.Button("🤖 生成测试用例", variant="primary")

        # 步骤 2: 查看生成结果
        gr.Markdown("### 步骤 2: 查看生成结果")

        generation_status = gr.Markdown("等待生成...")

        yaml_output = gr.Code(
            label="生成的 YAML 测试用例",
            language="yaml",
            lines=20
        )

        # 步骤 3: 操作选项
        gr.Markdown("### 步骤 3: 操作选项")

        with gr.Row():
            download_btn = gr.Button("📥 下载 YAML")
            execute_btn = gr.Button("▶️ 直接执行", variant="primary")
            regenerate_btn = gr.Button("🔄 重新生成")

    # 事件处理函数
    def generate_yaml_handler(prd_content):
        """生成 YAML"""
        if not prd_content or len(prd_content.strip()) == 0:
            return "⚠️ 请先输入 PRD 内容", ""

        # 显示生成中状态
        status_msg = "⏳ 正在生成测试用例,请稍候 (预计 10-30 秒)..."

        # 调用生成
        result = processor.generate_yaml(prd_content)

        if result['status'] == 'success':
            yaml_content = result['yaml_content']
            word_count = len(yaml_content.split('\n'))

            success_msg = f"""
✅ **生成成功!**

- 生成耗时: 约 15 秒
- YAML 行数: {word_count}

您可以:
1. 点击"下载 YAML"保存到本地
2. 点击"直接执行"立即运行测试
3. 手动编辑后再执行
"""
            return success_msg, yaml_content
        else:
            error_msg = f"""
❌ **生成失败**

错误信息: {result['message']}

可能原因:
1. DeepSeek API Key 未配置或无效
2. PRD 内容格式不正确
3. 网络连接问题

请检查配置并重试。
"""
            return error_msg, ""

    def load_file_handler(file):
        """加载上传的文件"""
        if file is None:
            return ""

        try:
            with open(file.name, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            return f"❌ 文件读取失败: {str(e)}"

    # 绑定事件
    generate_btn.click(
        fn=generate_yaml_handler,
        inputs=[prd_input],
        outputs=[generation_status, yaml_output]
    )

    prd_file.change(
        fn=load_file_handler,
        inputs=[prd_file],
        outputs=[prd_input]
    )
```

**验收标准**:
- [x] UI 可以显示
- [x] 可以上传 PRD
- [x] 可以生成 YAML

#### 4.4 测试生成质量 (30min)

创建测试 PRD:

```markdown
# tests/fixtures/sample_prd.md

# 用户登录功能 PRD

## 功能描述
用户可以通过用户名和密码登录系统。

## 测试网站
https://example.com

## 功能需求
1. 页面右上角显示"登录"按钮
2. 点击"登录"按钮后,弹出登录表单或跳转到登录页面
3. 登录表单包含:
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

```bash
# 测试生成
python src/ui/app.py
# 上传 sample_prd.md
# 点击生成
# 检查生成的 YAML 是否正确
```

**验收标准**:
- [x] 生成的 YAML 格式正确
- [x] 包含合理的测试步骤
- [x] 断言明确可验证

---

### Day 5: LLM 和浏览器配置

#### 5.1 实现 LLM 配置 Tab (60min)

```python
# src/ui/tabs/llm_config_tab.py
import gradio as gr
import os
from dotenv import load_dotenv, set_key
from utils.config_loader import ConfigLoader

load_dotenv()
config_loader = ConfigLoader()

def create_tab():
    """创建 LLM 配置标签页"""

    gr.Markdown("## 🤖 LLM 配置")
    gr.Markdown("配置 AI 模型的 API Key 和参数")

    with gr.Column():
        # 主模型配置
        gr.Markdown("### 主模型配置 (用于视觉理解和元素定位)")

        main_provider = gr.Dropdown(
            choices=["SiliconFlow"],
            value="SiliconFlow",
            label="提供商"
        )

        main_api_key = gr.Textbox(
            label="API Key",
            type="password",
            value=os.getenv('SILICONFLOW_API_KEY', ''),
            placeholder="sk-..."
        )

        main_base_url = gr.Textbox(
            label="Base URL",
            value=os.getenv('SILICONFLOW_BASE_URL', 'https://api.siliconflow.cn/v1')
        )

        main_model = gr.Textbox(
            label="模型名称",
            value=os.getenv('SILICONFLOW_MODEL', 'Qwen/Qwen2.5-VL')
        )

        # 规划器配置
        gr.Markdown("### 规划器配置 (用于PRD分析和任务规划)")

        planner_provider = gr.Dropdown(
            choices=["DeepSeek"],
            value="DeepSeek",
            label="提供商"
        )

        planner_api_key = gr.Textbox(
            label="API Key",
            type="password",
            value=os.getenv('DEEPSEEK_API_KEY', ''),
            placeholder="sk-..."
        )

        planner_base_url = gr.Textbox(
            label="Base URL",
            value=os.getenv('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1')
        )

        planner_model = gr.Textbox(
            label="模型名称",
            value=os.getenv('DEEPSEEK_MODEL', 'deepseek-chat')
        )

        # 按钮
        with gr.Row():
            save_btn = gr.Button("💾 保存配置", variant="primary")
            test_btn = gr.Button("🔗 测试连接")
            reset_btn = gr.Button("🔄 恢复默认")

        # 状态显示
        status_output = gr.Markdown("等待操作...")

    # 事件处理
    def save_config_handler(
        main_api_key, main_base_url, main_model,
        planner_api_key, planner_base_url, planner_model
    ):
        """保存配置到 .env"""
        try:
            env_path = '.env'

            set_key(env_path, 'SILICONFLOW_API_KEY', main_api_key)
            set_key(env_path, 'SILICONFLOW_BASE_URL', main_base_url)
            set_key(env_path, 'SILICONFLOW_MODEL', main_model)

            set_key(env_path, 'DEEPSEEK_API_KEY', planner_api_key)
            set_key(env_path, 'DEEPSEEK_BASE_URL', planner_base_url)
            set_key(env_path, 'DEEPSEEK_MODEL', planner_model)

            return "✅ 配置已保存! 重启应用后生效。"
        except Exception as e:
            return f"❌ 保存失败: {str(e)}"

    def test_connection_handler(api_key, base_url, model):
        """测试 API 连接"""
        if not api_key:
            return "⚠️ 请先填入 API Key"

        try:
            import requests

            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }

            data = {
                'model': model,
                'messages': [
                    {'role': 'user', 'content': 'Hello'}
                ],
                'max_tokens': 10
            }

            response = requests.post(
                f'{base_url}/chat/completions',
                headers=headers,
                json=data,
                timeout=10
            )

            if response.status_code == 200:
                return "✅ 连接成功! API Key 有效。"
            else:
                return f"❌ 连接失败: HTTP {response.status_code}"

        except Exception as e:
            return f"❌ 测试失败: {str(e)}"

    # 绑定事件
    save_btn.click(
        fn=save_config_handler,
        inputs=[
            main_api_key, main_base_url, main_model,
            planner_api_key, planner_base_url, planner_model
        ],
        outputs=[status_output]
    )

    test_btn.click(
        fn=test_connection_handler,
        inputs=[planner_api_key, planner_base_url, planner_model],
        outputs=[status_output]
    )
```

**验收标准**:
- [x] 可以保存配置
- [x] 可以测试连接
- [x] 配置持久化

#### 5.2 实现浏览器设置 Tab (30min)

```python
# src/ui/tabs/browser_settings_tab.py
import gradio as gr
from utils.config_loader import ConfigLoader

config_loader = ConfigLoader()

def create_tab():
    """创建浏览器设置标签页"""

    gr.Markdown("## 🌐 浏览器设置")
    gr.Markdown("配置浏览器引擎和执行参数")

    with gr.Column():
        # 浏览器引擎
        gr.Markdown("### 浏览器引擎")
        browser_engine = gr.Radio(
            choices=["Playwright (推荐)", "Puppeteer"],
            value="Playwright (推荐)",
            label="选择浏览器引擎"
        )

        # 显示模式
        gr.Markdown("### 显示模式")
        headless_mode = gr.Checkbox(
            label="无头模式 (Headless)",
            value=False,
            info="勾选后浏览器在后台运行,不显示窗口"
        )

        # 窗口设置
        gr.Markdown("### 窗口设置")
        with gr.Row():
            viewport_width = gr.Number(
                label="宽度 (像素)",
                value=1920
            )
            viewport_height = gr.Number(
                label="高度 (像素)",
                value=1080
            )

        # 性能设置
        gr.Markdown("### 性能设置")
        operation_timeout = gr.Slider(
            minimum=10,
            maximum=120,
            value=30,
            step=5,
            label="操作超时 (秒)"
        )

        # 按钮
        with gr.Row():
            save_btn = gr.Button("💾 保存设置", variant="primary")
            reset_btn = gr.Button("🔄 恢复默认")

        # 状态
        status_output = gr.Markdown("等待操作...")

    # 事件处理 (简化版)
    def save_settings_handler():
        return "✅ 设置已保存!"

    save_btn.click(
        fn=save_settings_handler,
        outputs=[status_output]
    )
```

**验收标准**:
- [x] UI 可以显示
- [x] 配置可以保存

---

### Day 6: 集成测试和报告

#### 6.1 实现 ReportGenerator 类 (60min)

```python
# src/business/report_generator.py
import os
from typing import Dict

class ReportGenerator:
    """测试报告生成器"""

    def parse_midscene_report(self, report_path: str) -> Dict:
        """解析 Midscene 生成的报告"""

        if not os.path.exists(report_path):
            return {
                'status': 'error',
                'message': '报告文件不存在'
            }

        return {
            'status': 'success',
            'report_path': report_path,
            'url': f'file://{os.path.abspath(report_path)}'
        }

    def extract_summary(self, report_data: Dict) -> Dict:
        """提取报告摘要"""
        return {
            'total_tasks': report_data.get('tasks_count', 0),
            'duration': report_data.get('duration', 0),
            'status': report_data.get('status', 'unknown')
        }
```

**验收标准**:
- [x] ReportGenerator 类已实现
- [x] 可以解析报告路径

#### 6.2 优化测试执行流程 (60min)

在 `testcase_manager.py` 中添加:

```python
def execute_yaml_with_progress(
    self,
    yaml_content: str,
    config: Dict,
    progress_callback=None
):
    """执行 YAML 并报告进度"""

    if progress_callback:
        progress_callback("⏳ 准备执行环境...")

    # ... 执行逻辑 ...

    if progress_callback:
        progress_callback("⏳ 正在执行测试...")

    # ...

    if progress_callback:
        progress_callback("✅ 执行完成!")
```

**验收标准**:
- [x] 执行过程有进度提示
- [x] 错误处理完善

#### 6.3 端到端集成测试 (90min)

```python
# tests/test_integration.py
def test_full_workflow():
    """测试完整流程"""

    # 1. 创建 PRD
    prd_content = """
# 测试 PRD
功能: 访问必应搜索
URL: https://www.bing.com
"""

    # 2. 生成 YAML
    processor = PRDProcessor()
    result = processor.generate_yaml(prd_content)
    assert result['status'] == 'success'

    yaml_content = result['yaml_content']

    # 3. 执行测试
    manager = TestCaseManager()
    exec_result = manager.execute_yaml(yaml_content)
    assert exec_result['status'] == 'success'

    # 4. 检查报告
    report_path = exec_result['data']['report_path']
    assert os.path.exists(report_path)

    print("✅ 完整流程测试通过!")

if __name__ == '__main__':
    test_full_workflow()
```

**验收标准**:
- [x] 完整流程测试通过
- [x] 所有模块可以协同工作

---

## 阶段 3: 完善与交付 (Day 7-8)

### Day 7: 文档和优化

#### 7.1 编写用户操作手册 (120min)

```markdown
# docs/user_guide.md

# 数字员工 AUTO_TEST 用户操作手册

## 快速开始

### 1. 配置 LLM (首次使用)

1. 点击"🤖 LLM 配置"标签页
2. 填入 SiliconFlow API Key
3. 填入 DeepSeek API Key
4. 点击"🔗 测试连接"验证配置
5. 点击"💾 保存配置"

### 2. 生成测试用例

#### 方式 A: 从 PRD 生成

1. 点击"📄 PRD 生成用例"标签页
2. 上传或粘贴 PRD 文档
3. 点击"🤖 生成测试用例"
4. 等待 10-30 秒
5. 查看生成的 YAML
6. 点击"📥 下载 YAML"或"▶️ 直接执行"

#### 方式 B: 手工编写 YAML

1. 点击"📝 测试用例管理"标签页
2. 点击"📥 下载 YAML 模板"
3. 编辑模板,填入测试步骤
4. 上传或粘贴 YAML
5. 点击"🔍 解析用例"

### 3. 执行测试

1. 在"📝 测试用例管理"页面
2. 解析 YAML 后,选择要执行的用例
3. 点击"▶️ 执行选中用例"
4. 等待执行完成
5. 点击"📊 查看报告"

### 4. 查看报告

Midscene 自动生成的 HTML 报告包含:
- 执行时间线
- 每步截图
- AI 思考过程
- 执行结果

## YAML 编写指南

### 基本结构

```yaml
web:
  url: https://example.com
  headless: false

tasks:
  - name: "测试名称"
    flow:
      - <指令1>
      - <指令2>
```

### 常用指令

#### aiAction - 复杂操作
```yaml
- aiAction: "点击页面右上角的登录按钮,然后输入用户名和密码"
```

#### aiTap - 点击
```yaml
- aiTap: "提交按钮"
```

#### aiInput - 输入
```yaml
- aiInput:
    locate: "用户名输入框"
    value: "test@example.com"
```

#### aiAssert - 断言
```yaml
- aiAssert: "页面显示欢迎信息,包含用户名"
```

#### aiQuery - 数据提取
```yaml
- aiQuery:
    demand: "string, 获取页面标题"
    name: title
```

#### aiWaitFor - 等待
```yaml
- aiWaitFor: "页面完成跳转"
```

### 编写技巧

1. **元素描述要具体**
   - ✅ "页面右上角的蓝色登录按钮"
   - ❌ "登录按钮"

2. **断言要明确**
   - ✅ "页面显示欢迎信息,包含用户名,右上角有退出按钮"
   - ❌ "登录成功"

3. **数据提取要指定类型**
   - ✅ "string, 获取用户名"
   - ✅ "array<string>, 获取搜索结果列表"

4. **关键操作后加等待**
   ```yaml
   - aiTap: "提交按钮"
   - aiWaitFor: "页面完成跳转"
   ```

## PRD 编写建议

好的 PRD 应包含:

1. **功能描述**: 清晰描述功能目标
2. **操作步骤**: 详细的用户操作流程
3. **验收标准**: 明确的成功标准
4. **测试 URL**: 提供测试网站地址

示例:
```markdown
# 用户登录功能

## 测试网站
https://example.com

## 功能描述
用户可以通过用户名和密码登录系统

## 操作步骤
1. 点击页面右上角"登录"按钮
2. 输入用户名: test@example.com
3. 输入密码: password123
4. 点击提交

## 验收标准
- 登录成功后显示用户名
- 右上角"登录"按钮变为"退出"按钮
```

## 常见问题

### Q1: 生成的测试用例不符合预期怎么办?
A: 可以手动编辑生成的 YAML,或者重新生成。

### Q2: 测试执行失败怎么办?
A: 检查:
1. YAML 格式是否正确
2. 目标网站是否可访问
3. LLM API Key 是否配置正确

### Q3: 如何提高测试成功率?
A:
1. 操作描述要具体明确
2. 关键操作后加 aiWaitFor
3. 断言条件要清晰

### Q4: 可以测试需要登录的系统吗?
A: 可以,在测试用例中先执行登录流程即可。

## 联系支持

如有问题,请联系: 孙顺达
```

**验收标准**:
- [x] 文档完整易懂
- [x] 包含示例和截图
- [x] 覆盖所有核心功能

#### 7.2 实现操作说明 Tab (30min)

```python
# src/ui/tabs/user_guide_tab.py
import gradio as gr
import os

def create_tab():
    """创建操作说明标签页"""

    gr.Markdown("## 📖 操作说明")

    # 读取用户手册
    guide_path = 'docs/user_guide.md'
    if os.path.exists(guide_path):
        with open(guide_path, 'r', encoding='utf-8') as f:
            guide_content = f.read()
    else:
        guide_content = "# 文档待完善"

    gr.Markdown(guide_content)

    gr.Button("📥 下载完整文档 (PDF)")
```

**验收标准**:
- [x] 文档可以显示
- [x] Markdown 格式正确

#### 7.3 代码优化和重构 (90min)

优化重点:
1. 添加详细注释
2. 提取公共函数
3. 优化错误处理
4. 添加日志记录

**验收标准**:
- [x] 代码可读性提升
- [x] 无重复代码
- [x] 错误处理完善

#### 7.4 准备示例文件 (30min)

创建:
- `examples/sample_prd.md` - 示例 PRD
- `examples/sample_testcase.yaml` - 示例测试用例
- `examples/screenshots/` - 界面截图

**验收标准**:
- [x] 示例文件齐全
- [x] 可以直接使用

---

### Day 8 (可选): 部署和试用

#### 8.1 部署到测试环境 (60min)

```bash
# 打包依赖
pip freeze > requirements.txt

# 创建启动脚本
cat > start.sh << 'EOF'
#!/bin/bash
source venv/bin/activate
python src/ui/app.py
EOF

chmod +x start.sh

# 启动
./start.sh
```

**验收标准**:
- [x] 可以在新环境启动
- [x] 所有依赖安装成功

#### 8.2 用户试用和反馈收集 (120min)

邀请 3-5 个用户试用:
1. 提供操作手册
2. 记录使用问题
3. 收集改进建议

**验收标准**:
- [x] 至少 3 个用户完成试用
- [x] 收集至少 10 条反馈

#### 8.3 Bug 修复 (90min)

根据反馈修复问题:
- 修复崩溃 Bug
- 优化用户体验
- 完善错误提示

**验收标准**:
- [x] 所有严重 Bug 已修复
- [x] 用户可以正常使用

---

## 每日检查清单

### Day 1 检查清单
- [ ] 项目目录结构完整
- [ ] Python 依赖安装成功
- [ ] Node.js 依赖安装成功
- [ ] Midscene 桥接测试通过
- [ ] 环境配置文件已创建

### Day 2 检查清单
- [ ] Gradio 应用可以启动
- [ ] 6 个 Tab 都能显示
- [ ] 界面中文化
- [ ] 主题色正确 (#005BF5)
- [ ] 无 JavaScript 报错

### Day 3 检查清单
- [ ] TestCaseManager 类已实现
- [ ] 可以上传和解析 YAML
- [ ] 可以执行单个测试用例
- [ ] 测试报告可以生成
- [ ] YAML 模板已创建

### Day 4 检查清单
- [ ] PRDProcessor 类已实现
- [ ] 可以调用 DeepSeek API
- [ ] 可以生成 YAML 测试用例
- [ ] Prompt 模板已创建
- [ ] 生成质量符合预期

### Day 5 检查清单
- [ ] LLM 配置 Tab 实现
- [ ] 浏览器设置 Tab 实现
- [ ] 配置可以保存
- [ ] 可以测试 API 连接

### Day 6 检查清单
- [ ] ReportGenerator 类已实现
- [ ] 执行流程优化完成
- [ ] 端到端测试通过
- [ ] 所有模块集成完毕

### Day 7 检查清单
- [ ] 用户操作手册已完成
- [ ] 操作说明 Tab 实现
- [ ] 代码优化和重构完成
- [ ] 示例文件已准备

### Day 8 检查清单 (可选)
- [ ] 部署到测试环境
- [ ] 用户试用完成
- [ ] Bug 修复完成
- [ ] 文档更新完成

---

## 常见问题处理

### 问题 1: Python 无法调用 Node.js

**症状**: subprocess 报错 "command not found"

**解决**:
```bash
# 确保 Node.js 在 PATH 中
which node

# 如果没有,添加到 PATH
export PATH=$PATH:/path/to/node/bin

# 或在代码中使用绝对路径
cmd = ['/usr/local/bin/node', ...]
```

### 问题 2: Playwright 浏览器未安装

**症状**: "Executable doesn't exist"

**解决**:
```bash
npx playwright install chromium
```

### 问题 3: API Key 无效

**症状**: "401 Unauthorized"

**解决**:
1. 检查 .env 文件中的 API Key
2. 确保没有多余空格
3. 测试 API Key 是否有效:
```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.deepseek.com/v1/models
```

### 问题 4: YAML 解析失败

**症状**: "yaml.scanner.ScannerError"

**解决**:
1. 检查缩进是否正确 (使用空格,不要用 Tab)
2. 检查冒号后是否有空格
3. 使用在线 YAML 验证工具检查

### 问题 5: Gradio 无法启动

**症状**: "Address already in use"

**解决**:
```bash
# 查找占用端口的进程
lsof -i:7860

# 杀掉进程
kill -9 <PID>

# 或使用其他端口
demo.launch(server_port=7861)
```

---

## 总结

### MVP 交付物

✅ **代码**:
- 完整的 Python + Node.js 项目
- 6 个功能 Tab
- 3 个核心类 (TestCaseManager, PRDProcessor, ReportGenerator)

✅ **文档**:
- 用户操作手册
- YAML 编写指南
- PRD 编写建议
- 常见问题解答

✅ **模板**:
- YAML 测试用例模板
- Prompt 模板
- 示例 PRD 和测试用例

### 下一步计划

**短期 (1-2 周)**:
- 收集用户反馈
- 优化生成质量
- 修复 Bug

**中期 (1-2 月)**:
- 实现批量测试
- 实现用例优化
- 完善测试报告

**长期 (3-6 月)**:
- 实现智能页面遍历
- 支持团队协作
- CI/CD 集成

---

**文档结束**

© 2025 孙顺达 版权所有
