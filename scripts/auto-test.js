#!/usr/bin/env node

/**
 * 自动化测试验证脚本
 *
 * 功能:
 * 1. 自动检测环境配置
 * 2. 运行基础测试用例
 * 3. 验证服务启动
 * 4. 自动修复常见问题
 * 5. 生成测试报告
 *
 * 作者: 孙顺达
 * 版本: v1.0
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`
  }[type];

  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// 测试结果
const testResults = {
  passed: [],
  failed: [],
  skipped: []
};

// 1. 检查环境配置
async function checkEnvironment() {
  log('开始检查环境配置...', 'info');

  const checks = [
    { name: 'Node.js 版本', check: checkNodeVersion },
    { name: 'pnpm 安装', check: checkPnpm },
    { name: '.env 文件', check: checkEnvFile },
    { name: 'API Keys 配置', check: checkApiKeys },
    { name: '依赖安装', check: checkDependencies },
    { name: '项目构建', check: checkBuild }
  ];

  for (const { name, check } of checks) {
    try {
      log(`检查: ${name}...`, 'info');
      await check();
      log(`${name} ✓`, 'success');
      testResults.passed.push(name);
    } catch (error) {
      log(`${name} 失败: ${error.message}`, 'error');
      testResults.failed.push(name);

      // 尝试自动修复
      try {
        await autoFix(name, error);
      } catch (fixError) {
        log(`自动修复失败: ${fixError.message}`, 'error');
      }
    }
  }
}

// 检查 Node.js 版本
function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);

  if (major < 18) {
    throw new Error(`Node.js 版本过低 (${version}), 需要 >= 18.19.0`);
  }

  log(`Node.js 版本: ${version}`, 'info');
}

// 检查 pnpm
function checkPnpm() {
  try {
    const version = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
    log(`pnpm 版本: ${version}`, 'info');
  } catch (error) {
    throw new Error('pnpm 未安装, 请运行: corepack enable');
  }
}

// 检查 .env 文件
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    throw new Error('.env 文件不存在');
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  log(`.env 文件存在 (${envContent.split('\n').length} 行)`, 'info');
}

// 检查 API Keys
function checkApiKeys() {
  require('dotenv').config();

  const requiredKeys = [
    'SILICONFLOW_API_KEY',
    'DEEPSEEK_API_KEY'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`缺少 API Keys: ${missingKeys.join(', ')}`);
  }

  log('所有必需的 API Keys 已配置', 'info');
}

// 检查依赖
function checkDependencies() {
  const packageLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');

  if (!fs.existsSync(packageLockPath)) {
    throw new Error('依赖未安装, 需要运行: pnpm install');
  }

  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error('node_modules 不存在');
  }

  log('依赖已安装', 'info');
}

// 检查构建
function checkBuild() {
  const coreDistPath = path.join(process.cwd(), 'packages/core/dist');

  if (!fs.existsSync(coreDistPath)) {
    throw new Error('项目未构建, 需要运行: pnpm run build');
  }

  log('项目已构建', 'info');
}

// 2. 自动修复
async function autoFix(name, error) {
  log(`尝试自动修复: ${name}...`, 'warning');

  const fixes = {
    'pnpm 安装': () => {
      log('运行: corepack enable', 'info');
      execSync('corepack enable', { stdio: 'inherit' });
    },
    '.env 文件': () => {
      const examplePath = path.join(process.cwd(), '.env.example');
      const envPath = path.join(process.cwd(), '.env');

      if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath);
        log('已从 .env.example 复制 .env 文件', 'success');
        log('请编辑 .env 文件,填入您的 API Keys', 'warning');
      } else {
        // 创建基本的 .env 文件
        const envTemplate = `# AI 模型配置
SILICONFLOW_API_KEY=your_api_key_here
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-VL

DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# 浏览器配置
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# 缓存配置
MIDSCENE_CACHE=true
MIDSCENE_OUTPUT_DIR=./midscene_run
`;
        fs.writeFileSync(envPath, envTemplate);
        log('已创建 .env 文件模板', 'success');
        log('请编辑 .env 文件,填入您的 API Keys', 'warning');
      }
    },
    '依赖安装': () => {
      log('运行: pnpm install (这可能需要几分钟)...', 'info');
      execSync('pnpm install', { stdio: 'inherit' });
      log('依赖安装完成', 'success');
    },
    '项目构建': () => {
      log('运行: pnpm run build (这可能需要几分钟)...', 'info');
      execSync('pnpm run build', { stdio: 'inherit' });
      log('项目构建完成', 'success');
    }
  };

  const fix = fixes[name];
  if (fix) {
    fix();
    log(`${name} 修复成功`, 'success');
  } else {
    throw new Error(`没有找到 ${name} 的自动修复方案`);
  }
}

// 3. 运行基础测试
async function runBasicTests() {
  log('\n开始运行基础测试...', 'info');

  const tests = [
    { name: '单元测试', command: 'pnpm test --run', optional: false },
    { name: 'Playwright 浏览器', command: 'npx playwright install chromium --with-deps', optional: false }
  ];

  for (const { name, command, optional } of tests) {
    try {
      log(`测试: ${name}...`, 'info');

      // 运行测试命令
      execSync(command, {
        stdio: 'pipe',
        encoding: 'utf-8',
        timeout: 300000  // 5 分钟超时
      });

      log(`${name} 通过 ✓`, 'success');
      testResults.passed.push(name);
    } catch (error) {
      if (optional) {
        log(`${name} 跳过 (可选)`, 'warning');
        testResults.skipped.push(name);
      } else {
        log(`${name} 失败`, 'error');
        log(`错误信息: ${error.message}`, 'error');
        testResults.failed.push(name);
      }
    }
  }
}

// 4. 创建示例测试用例
function createExampleTest() {
  log('\n创建示例测试用例...', 'info');

  const testYaml = `# 自动化测试示例
# 生成时间: ${new Date().toISOString()}

web:
  url: https://www.bing.com
  headless: true

tasks:
  - name: "基础测试 - 访问 Bing 搜索"
    flow:
      - aiQuery:
          demand: "string, 获取页面标题"
          name: pageTitle
      - aiAssert: "页面标题包含 'Bing'"
`;

  const testPath = path.join(process.cwd(), 'auto-test-example.yaml');
  fs.writeFileSync(testPath, testYaml);

  log(`示例测试用例已创建: ${testPath}`, 'success');
  return testPath;
}

// 5. 运行示例测试
async function runExampleTest(testPath) {
  log('\n运行示例测试...', 'info');

  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['midscene', 'run', testPath], {
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (code === 0) {
        log('示例测试通过 ✓', 'success');
        testResults.passed.push('示例测试');
        resolve();
      } else {
        log('示例测试失败', 'error');
        log(`退出代码: ${code}`, 'error');
        testResults.failed.push('示例测试');
        reject(new Error(`测试失败 (退出代码: ${code})`));
      }
    });

    // 设置超时
    setTimeout(() => {
      child.kill();
      reject(new Error('测试超时 (60秒)'));
    }, 60000);
  });
}

// 6. 生成测试报告
function generateReport() {
  log('\n========== 测试报告 ==========', 'info');

  const total = testResults.passed.length + testResults.failed.length + testResults.skipped.length;
  const passRate = total > 0 ? (testResults.passed.length / total * 100).toFixed(2) : 0;

  console.log(`\n总计: ${total} 项测试`);
  console.log(`${colors.green}通过: ${testResults.passed.length}${colors.reset}`);
  console.log(`${colors.red}失败: ${testResults.failed.length}${colors.reset}`);
  console.log(`${colors.yellow}跳过: ${testResults.skipped.length}${colors.reset}`);
  console.log(`通过率: ${passRate}%\n`);

  if (testResults.passed.length > 0) {
    console.log(`${colors.green}✓ 通过的测试:${colors.reset}`);
    testResults.passed.forEach(test => console.log(`  - ${test}`));
    console.log('');
  }

  if (testResults.failed.length > 0) {
    console.log(`${colors.red}✗ 失败的测试:${colors.reset}`);
    testResults.failed.forEach(test => console.log(`  - ${test}`));
    console.log('');
  }

  if (testResults.skipped.length > 0) {
    console.log(`${colors.yellow}⊘ 跳过的测试:${colors.reset}`);
    testResults.skipped.forEach(test => console.log(`  - ${test}`));
    console.log('');
  }

  console.log('='.repeat(50) + '\n');

  // 保存报告到文件
  const reportPath = path.join(process.cwd(), 'auto-test-report.json');
  const reportData = {
    timestamp: new Date().toISOString(),
    total,
    passed: testResults.passed.length,
    failed: testResults.failed.length,
    skipped: testResults.skipped.length,
    passRate,
    results: testResults
  };

  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  log(`测试报告已保存: ${reportPath}`, 'success');

  // 返回是否所有测试通过
  return testResults.failed.length === 0;
}

// 主函数
async function main() {
  console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}   AUTO_TEST 自动化测试验证脚本 v1.0${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  try {
    // 1. 检查环境
    await checkEnvironment();

    // 2. 运行基础测试
    await runBasicTests();

    // 3. 创建并运行示例测试
    try {
      const testPath = createExampleTest();
      await runExampleTest(testPath);
    } catch (error) {
      log(`示例测试执行失败: ${error.message}`, 'error');
      log('这可能是由于 API Key 未配置或网络问题', 'warning');
      testResults.failed.push('示例测试执行');
    }

    // 4. 生成报告
    const allPassed = generateReport();

    if (allPassed) {
      log('\n🎉 所有测试通过! 环境配置正确, 可以开始使用了。', 'success');
      process.exit(0);
    } else {
      log('\n⚠️  部分测试失败, 请查看上述错误信息并修复。', 'warning');
      process.exit(1);
    }
  } catch (error) {
    log(`\n致命错误: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main().catch(error => {
    console.error('未捕获的错误:', error);
    process.exit(1);
  });
}

module.exports = { main };
