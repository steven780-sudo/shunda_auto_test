# Midscene 故障排查完全指南

## 📋 目录

1. [常见错误速查表](#常见错误速查表)
2. [配置验证方法](#配置验证方法)
3. [各平台 API 配置详解](#各平台-api-配置详解)
4. [调试步骤](#调试步骤)
5. [环境变量优先级](#环境变量优先级)
6. [常见问题 FAQ](#常见问题-faq)

---

## ⚡ 常见错误速查表

### 1. 401 Unauthorized

**错误信息**:
```
failed to call AI model service: 401 status code
```

**原因**:
- ❌ API Key 无效或过期
- ❌ 环境变量未生效
- ❌ 系统环境变量覆盖了 .env 配置

**解决方案**:
```bash
# 1. 检查 API Key 是否正确
echo $MIDSCENE_OPENAI_API_KEY

# 2. 检查系统环境变量
env | grep OPENAI

# 3. 清除系统环境变量
unset OPENAI_API_KEY
unset OPENAI_BASE_URL

# 4. 重启服务
pkill -f "pnpm run demo"
cd apps/playground && __SERVER_URL__=http://localhost:5870 pnpm run demo
```

**验证 API Key**:
```bash
# SiliconFlow
curl https://api.siliconflow.cn/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# 火山引擎
curl https://ark.cn-beijing.volces.com/api/v3/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

### 2. 500 Internal Server Error

**错误信息**:
```
failed to call AI model service: 500 status code (no body)
```

**原因**:
- ❌ **模型名称错误**（最常见）
- ❌ 请求格式不正确
- ❌ 余额不足
- ❌ API 端点错误

**解决方案**:

#### 问题 A: 模型名称错误

火山引擎 UI-TARS 需要使用**推理接入点 ID**，不是模型名称！

```bash
# ❌ 错误配置
MIDSCENE_MODEL_NAME=Doubao-1.5-UI-TARS

# ✅ 正确配置（使用 endpoint ID）
MIDSCENE_MODEL_NAME=ep-20250113-xxxxx
```

**如何获取 endpoint ID**:
1. 登录 [火山引擎控制台](https://console.volcengine.com/)
2. 进入 **ARK** 服务
3. 找到 **推理接入点** 页面
4. 创建或选择 **doubao-1.5-ui-tars** 模型的接入点
5. 复制 **推理接入点 ID**（格式：`ep-20250113-xxxxx`）

#### 问题 B: 余额不足

```bash
# 测试 API 调用
curl -s https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2-VL-72B-Instruct",
    "messages": [{"role": "user", "content": "test"}]
  }'

# 如果返回 insufficient balance，需要充值
```

---

### 3. 404 Not Found

**错误信息**:
```
The model or endpoint xxx does not exist
```

**原因**:
- ❌ 模型名称拼写错误
- ❌ 模型不存在于该平台
- ❌ 账户未开通该模型权限

**解决方案**:

**常见模型名称对照表**:

| 平台 | 模型类型 | 正确名称 | 常见错误 |
|------|---------|----------|----------|
| **SiliconFlow** | Qwen2-VL | `Qwen/Qwen2-VL-72B-Instruct` | `qwen2-vl`, `Qwen2-VL` |
| **SiliconFlow** | DeepSeek | `deepseek-ai/DeepSeek-V3.2-Exp` | `deepseek-v3`, `DeepSeek-V3.2` |
| **SiliconFlow** | QVQ | `Qwen/QVQ-72B-Preview` | `QVQ-72B`, `qvq` |
| **火山引擎** | UI-TARS | `ep-20250113-xxxxx` | `Doubao-1.5-UI-TARS`, `ui-tars` |
| **火山引擎** | 豆包 | `ep-20250113-xxxxx` | `doubao-1.5-pro`, `Doubao` |

**查询可用模型**:
```bash
# SiliconFlow
curl https://api.siliconflow.cn/v1/models \
  -H "Authorization: Bearer YOUR_KEY" | jq '.data[].id'

# 火山引擎 - 需要在控制台查看推理接入点
```

---

### 4. JSON 解析错误

**错误信息**:
```
failed to parse json response: Unexpected token...
```

**原因**:
- ❌ 模型返回文本而不是 JSON（如 QVQ-72B-Preview）
- ❌ Planning 模型不支持结构化输出

**解决方案**:

使用**混合配置**：
```bash
# Planning 必须使用支持 JSON 的模型
MIDSCENE_PLANNING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
# 或
MIDSCENE_PLANNING_MODEL_NAME=deepseek-ai/DeepSeek-V3.2-Exp

# VQA/Grounding 可以使用推理模型
MIDSCENE_VQA_MODEL_NAME=Qwen/QVQ-72B-Preview
MIDSCENE_GROUNDING_MODEL_NAME=Qwen/QVQ-72B-Preview
```

---

### 5. 环境变量未生效

**错误信息**:
```
The OPENAI_API_KEY must be a non-empty string, but got: undefined
```

**原因**:
- ❌ .env 文件未加载
- ❌ 环境变量名错误
- ❌ 系统环境变量冲突

**解决方案**:

**检查环境变量**:
```bash
# 1. 查看当前 shell 环境变量
env | grep MIDSCENE
env | grep OPENAI

# 2. 检查 .env 文件是否存在
cat /Users/sunshunda/Desktop/browser/auto_test/.env

# 3. 验证环境变量优先级
# 优先级：MIDSCENE_* > 系统 OPENAI_* > .env
```

**添加后备配置**:
```bash
# 在 .env 中同时配置有前缀和无前缀的变量
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=your-url
MIDSCENE_OPENAI_API_KEY=your-key
MIDSCENE_OPENAI_BASE_URL=your-url
```

---

### 6. 网络错误

**错误信息**:
```
ECONNREFUSED, ETIMEDOUT, ENOTFOUND
```

**原因**:
- ❌ 网络连接问题
- ❌ 代理配置错误
- ❌ API 端点地址错误

**解决方案**:
```bash
# 1. 测试网络连通性
ping ark.cn-beijing.volces.com
curl -I https://ark.cn-beijing.volces.com

# 2. 检查代理设置
env | grep -i proxy

# 3. 验证 API 端点
curl https://api.siliconflow.cn/v1/models
```

---

## 🔍 配置验证方法

### 快速验证脚本

创建 `test-api.sh`:

```bash
#!/bin/bash

echo "🔍 开始验证 Midscene API 配置..."
echo ""

# 读取 .env 文件
source .env

# 1. 验证 SiliconFlow DeepSeek (Planning)
echo "1️⃣ 测试 SiliconFlow DeepSeek-V3.2-Exp..."
response=$(curl -s https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer $MIDSCENE_PLANNING_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V3.2-Exp",
    "messages": [{"role": "user", "content": "Hi"}],
    "max_tokens": 10
  }')

if echo "$response" | grep -q "choices"; then
    echo "✅ DeepSeek-V3.2 配置正确"
else
    echo "❌ DeepSeek-V3.2 配置错误"
    echo "错误信息: $response"
fi
echo ""

# 2. 验证火山引擎 UI-TARS (VQA/Grounding)
echo "2️⃣ 测试火山引擎 UI-TARS..."
response=$(curl -s https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Authorization: Bearer $MIDSCENE_VQA_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MIDSCENE_VQA_MODEL_NAME\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hi\"}]
  }")

if echo "$response" | grep -q "choices"; then
    echo "✅ UI-TARS 配置正确"
else
    echo "❌ UI-TARS 配置错误"
    echo "错误信息: $response"
fi
echo ""

echo "验证完成！"
```

**使用方法**:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🌐 各平台 API 配置详解

### 1. 火山引擎 (UI-TARS / 豆包)

**步骤详解**:

1. **注册账号并开通服务**
   - 访问 https://console.volcengine.com/
   - 注册/登录账号
   - 开通 **ARK（大模型服务）**

2. **创建推理接入点**
   - 进入 ARK 控制台
   - 点击 **推理** → **推理接入点**
   - 点击 **创建推理接入点**
   - 选择模型：**doubao-1.5-ui-tars** 或 **doubao-1.5-pro**
   - 记录 **推理接入点 ID**（格式：`ep-20250113-xxxxx`）

3. **获取 API Key**
   - 进入 **API Key 管理**
   - 创建 API Key
   - 复制保存（只显示一次）

4. **配置 .env**
   ```bash
   # 火山引擎配置
   MIDSCENE_OPENAI_API_KEY=你的-api-key
   MIDSCENE_OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
   MIDSCENE_MODEL_NAME=ep-20250113-xxxxx  # 推理接入点 ID
   MIDSCENE_USE_VLM_UI_TARS=DOUBAO
   ```

5. **测试配置**
   ```bash
   curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer 你的-api-key" \
     -d '{
       "model": "ep-20250113-xxxxx",
       "messages": [{"role": "user", "content": "你好"}]
     }'
   ```

**常见陷阱**:
- ❌ 使用模型名称 `Doubao-1.5-UI-TARS`
- ✅ 必须使用推理接入点 ID `ep-20250113-xxxxx`

---

### 2. SiliconFlow (Qwen / DeepSeek)

**步骤详解**:

1. **注册账号**
   - 访问 https://siliconflow.cn/
   - 注册并登录

2. **获取 API Key**
   - 进入控制台
   - 点击 **API Keys**
   - 创建并复制 API Key

3. **查看可用模型**
   ```bash
   curl https://api.siliconflow.cn/v1/models \
     -H "Authorization: Bearer 你的-api-key"
   ```

4. **配置 .env**
   ```bash
   # SiliconFlow 配置
   MIDSCENE_OPENAI_API_KEY=sk-xxxxx
   MIDSCENE_OPENAI_BASE_URL=https://api.siliconflow.cn/v1
   MIDSCENE_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
   ```

5. **测试配置**
   ```bash
   curl https://api.siliconflow.cn/v1/chat/completions \
     -H "Authorization: Bearer 你的-api-key" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "Qwen/Qwen2-VL-72B-Instruct",
       "messages": [{"role": "user", "content": "你好"}]
     }'
   ```

**推荐模型**:
- **规划**: `deepseek-ai/DeepSeek-V3.2-Exp`
- **视觉**: `Qwen/Qwen2-VL-72B-Instruct`
- **推理**: `Qwen/QVQ-72B-Preview`

---

### 3. OpenAI (GPT-4o)

**配置 .env**:
```bash
MIDSCENE_OPENAI_API_KEY=sk-xxxxx
MIDSCENE_OPENAI_BASE_URL=https://api.openai.com/v1
MIDSCENE_MODEL_NAME=gpt-4o-2024-08-06
```

---

### 4. Anthropic (Claude)

**注意**: Anthropic SDK 对自定义代理支持有限

**方案 A: 使用官方 API**
```bash
MIDSCENE_USE_ANTHROPIC_SDK=1
ANTHROPIC_API_KEY=sk-ant-xxxxx
MIDSCENE_MODEL_NAME=claude-sonnet-4-20250514
```

**方案 B: OpenAI 兼容格式（推荐）**
```bash
MIDSCENE_OPENAI_API_KEY=你的-claude-key
MIDSCENE_OPENAI_BASE_URL=https://api.anthropic.com/v1
MIDSCENE_MODEL_NAME=claude-sonnet-4-20250514
```

---

## 🛠️ 调试步骤

### 标准调试流程

```bash
# 1. 检查 .env 文件
cat .env

# 2. 检查环境变量
env | grep MIDSCENE
env | grep OPENAI

# 3. 清理冲突的环境变量
unset OPENAI_API_KEY
unset OPENAI_BASE_URL

# 4. 测试 API 连通性
curl https://api.siliconflow.cn/v1/models \
  -H "Authorization: Bearer YOUR_KEY"

# 5. 验证模型名称
curl https://api.siliconflow.cn/v1/models \
  -H "Authorization: Bearer YOUR_KEY" | grep "Qwen2-VL"

# 6. 测试完整请求
curl https://api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2-VL-72B-Instruct",
    "messages": [{"role": "user", "content": "test"}],
    "max_tokens": 10
  }'

# 7. 重启服务
pkill -f "pnpm run demo"
cd apps/playground && __SERVER_URL__=http://localhost:5870 pnpm run demo

# 8. 查看实时日志
# 打开新终端查看输出
```

---

## ⚙️ 环境变量优先级

Midscene 读取环境变量的优先级（从高到低）:

```
1. MIDSCENE_* 前缀的环境变量（最高优先级）
   例: MIDSCENE_OPENAI_API_KEY

2. 系统环境变量（shell 环境）
   例: OPENAI_API_KEY

3. .env 文件中的配置（最低优先级）
```

**示例**:
```bash
# ~/.zshrc (系统环境)
export OPENAI_API_KEY=key-from-system

# .env 文件
OPENAI_API_KEY=key-from-env
MIDSCENE_OPENAI_API_KEY=key-from-midscene

# 最终使用: key-from-midscene
```

**解决优先级冲突**:
```bash
# 1. 注释掉 ~/.zshrc 中的配置
# export OPENAI_API_KEY=xxx

# 2. 重新加载配置
source ~/.zshrc

# 3. 验证环境变量已清除
env | grep OPENAI

# 4. 使用 MIDSCENE_ 前缀确保优先级
MIDSCENE_OPENAI_API_KEY=your-key
```

---

## ❓ 常见问题 FAQ

### Q1: 为什么配置了 .env 还是报错 API Key 未定义？

**A**: 环境变量冲突。检查：
```bash
# 1. 查看系统环境变量
env | grep OPENAI

# 2. 查看 shell 配置文件
cat ~/.zshrc | grep OPENAI
cat ~/.bashrc | grep OPENAI

# 3. 使用 MIDSCENE_ 前缀
MIDSCENE_OPENAI_API_KEY=your-key
```

---

### Q2: 火山引擎返回 404 model not found？

**A**: 需要使用推理接入点 ID，不是模型名称：
```bash
# ❌ 错误
MIDSCENE_MODEL_NAME=Doubao-1.5-UI-TARS

# ✅ 正确（从火山引擎控制台获取）
MIDSCENE_MODEL_NAME=ep-20250113-xxxxx
```

---

### Q3: QVQ-72B-Preview 报 JSON 解析错误？

**A**: QVQ 是推理模型，不支持 Planning。使用混合配置：
```bash
# Planning 用 Qwen2-VL 或 DeepSeek
MIDSCENE_PLANNING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct

# VQA/Grounding 可以用 QVQ
MIDSCENE_VQA_MODEL_NAME=Qwen/QVQ-72B-Preview
```

---

### Q4: 如何查看 API 调用的详细日志？

**A**: 设置调试日志：
```bash
# 在 .env 中添加
DEBUG=midscene:*
MIDSCENE_DEBUG=true

# 重启服务查看详细日志
```

---

### Q5: 多个模型配置，成本如何优化？

**A**: 根据调用频率分配模型：
```bash
# Planning - 调用少 → 用便宜的
MIDSCENE_PLANNING_MODEL_NAME=deepseek-ai/DeepSeek-V3.2-Exp

# Grounding - 调用多 → 用精准但性价比高的
MIDSCENE_GROUNDING_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct

# VQA - 调用中等 → 根据需求选择
MIDSCENE_VQA_MODEL_NAME=Qwen/Qwen2-VL-72B-Instruct
```

---

### Q6: 如何验证配置是否生效？

**A**: 查看服务启动日志：
```bash
# 启动服务后会显示
🚀 Starting Midscene Playground...
📱 Agent: PuppeteerAgent
🖥️ Page: PuppeteerWebPage

# 在第一次 API 调用时会打印模型信息
model, deepseek-ai/DeepSeek-V3.2-Exp, mode, default
model, ep-20250113-xxxxx, mode, vlm-ui-tars
```

---

## 📝 配置模板

### 混合配置模板（推荐）

```bash
# ========== 混合配置: DeepSeek (规划) + UI-TARS (视觉) ==========

# 后备配置
OPENAI_API_KEY=your-volcengine-key
OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3

# 主模型: 火山引擎 UI-TARS
MIDSCENE_OPENAI_API_KEY=your-volcengine-key
MIDSCENE_OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
MIDSCENE_MODEL_NAME=ep-20250113-xxxxx  # 你的推理接入点 ID
MIDSCENE_USE_VLM_UI_TARS=DOUBAO

# Planning: SiliconFlow DeepSeek-V3.2-Exp
MIDSCENE_PLANNING_OPENAI_API_KEY=your-siliconflow-key
MIDSCENE_PLANNING_OPENAI_BASE_URL=https://api.siliconflow.cn/v1
MIDSCENE_PLANNING_MODEL_NAME=deepseek-ai/DeepSeek-V3.2-Exp

# VQA: 火山引擎 UI-TARS
MIDSCENE_VQA_OPENAI_API_KEY=your-volcengine-key
MIDSCENE_VQA_OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
MIDSCENE_VQA_MODEL_NAME=ep-20250113-xxxxx

# Grounding: 火山引擎 UI-TARS
MIDSCENE_GROUNDING_OPENAI_API_KEY=your-volcengine-key
MIDSCENE_GROUNDING_OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
MIDSCENE_GROUNDING_MODEL_NAME=ep-20250113-xxxxx

# 可选配置
MIDSCENE_CACHE=true
MIDSCENE_OUTPUT_DIR=./midscene_run
```

---

## 🎯 快速故障排查清单

遇到问题时，按顺序检查：

- [ ] **检查 API Key 是否有效**
  ```bash
  curl API_URL -H "Authorization: Bearer YOUR_KEY"
  ```

- [ ] **检查模型名称是否正确**
  - 火山引擎：必须用 `ep-xxxxx`
  - SiliconFlow：完整路径如 `Qwen/Qwen2-VL-72B-Instruct`

- [ ] **检查环境变量是否生效**
  ```bash
  env | grep MIDSCENE
  ```

- [ ] **检查系统环境变量冲突**
  ```bash
  env | grep OPENAI
  cat ~/.zshrc | grep OPENAI
  ```

- [ ] **测试 API 连通性**
  ```bash
  curl -I API_URL
  ```

- [ ] **查看服务日志**
  - 启动时的配置信息
  - API 调用的错误详情

- [ ] **清理并重启服务**
  ```bash
  pkill -f "pnpm run demo"
  cd apps/playground && __SERVER_URL__=http://localhost:5870 pnpm run demo
  ```

---

## 📚 参考资源

- [Midscene 官方文档](https://midscenejs.com/)
- [模型提供商配置](https://midscenejs.com/model-provider.html)
- [火山引擎 ARK 文档](https://www.volcengine.com/docs/82379)
- [SiliconFlow 文档](https://docs.siliconflow.cn/)

---

## 💡 最佳实践

1. **使用 MIDSCENE_ 前缀** 避免环境变量冲突
2. **火山引擎用 endpoint ID** 不要用模型名称
3. **混合配置** Planning 用文本模型，视觉任务用视觉模型
4. **先测试 API** 确保配置正确后再启动服务
5. **查看日志** 第一次调用会打印模型信息
6. **保留后备配置** 同时配置 OPENAI_* 和 MIDSCENE_*

---

保存这份指南，以后遇到问题先查这里！🎉
