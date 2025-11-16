/**
 * 测试用例: 数字浙江统一社会信用代码查询
 *
 * 功能描述:
 * 1. 通过百度搜索"数字浙江"
 * 2. 点击进入百度百科页面
 * 3. 智能滚动查找"统一社会信用代码"
 * 4. 提取信用代码并截图
 * 5. 生成包含截图和数据的测试报告
 *
 * 运行方式:
 * npx tsx 数字浙江信用代码查询.ts
 *
 * 或使用 Vitest:
 * npx vitest run 数字浙江信用代码查询.test.ts
 */

import { PuppeteerAgent } from '@midscene/web/puppeteer';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// ========== 类型定义 ==========
interface CreditCodeData {
  creditCode: string | null;
  organizationName?: string;
  foundLocation?: string;
  error?: string;
}

interface TestResult {
  success: boolean;
  creditCode: string | null;
  screenshotPath?: string;
  timestamp: string;
  pageUrl: string;
  steps: StepResult[];
}

interface StepResult {
  stepName: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  timestamp: string;
}

/**
 * 测试类: 数字浙江信用代码查询
 */
class DigitalZhejiangCreditCodeTest {
  private browser!: Browser;
  private page!: Page;
  private agent!: PuppeteerAgent;
  private testResult: TestResult;
  private maxScrollAttempts = 5; // 最大滚动次数

  constructor() {
    this.testResult = {
      success: false,
      creditCode: null,
      timestamp: new Date().toISOString(),
      pageUrl: '',
      steps: [],
    };
  }

  /**
   * 初始化: 启动浏览器和创建 Agent
   */
  async setup() {
    console.log('🚀 初始化测试环境...\n');

    this.browser = await puppeteer.launch({
      headless: false, // 可视化模式，方便观察
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    this.page = await this.browser.newPage();

    // 设置 User-Agent 避免被识别为爬虫
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // 创建 Midscene Agent（自动生成报告）
    this.agent = new PuppeteerAgent(this.page, {
      generateReport: true, // ✅ 自动生成 HTML 报告
      autoPrintReportMsg: true, // ✅ 打印报告路径
      groupName: '数字浙江统一社会信用代码查询测试',
      groupDescription: '通过百度百科自动查询数字浙江的统一社会信用代码',
      cache: {
        enabled: false, // 禁用缓存，确保每次都是最新数据
        id: 'digital-zhejiang-credit-code',
      },
    });

    this.addStep('初始化浏览器', 'success', '浏览器和 Agent 初始化成功');
    console.log('✅ 测试环境初始化完成\n');
  }

  /**
   * 步骤 1: 百度搜索
   */
  async step1_BaiduSearch() {
    console.log('📝 步骤 1: 执行百度搜索\n');

    try {
      // 访问百度首页
      await this.page.goto('https://www.baidu.com', {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // 验证页面加载
      await this.agent.aiAssert('百度首页已加载，搜索框可见');
      this.addStep('访问百度首页', 'success', '页面加载成功');

      // 输入搜索关键词
      await this.agent.aiInput('搜索输入框', {
        value: '数字浙江',
      });
      this.addStep('输入搜索关键词', 'success', '已输入"数字浙江"');

      // 点击搜索按钮
      await this.agent.aiTap('百度一下按钮');
      this.addStep('点击搜索', 'success', '执行搜索');

      // 等待搜索结果
      await this.agent.aiWaitFor('搜索结果页面已加载完成', {
        timeoutMs: 10000,
      });
      this.addStep('等待搜索结果', 'success', '搜索结果加载完成');

      console.log('✅ 步骤 1 完成: 百度搜索成功\n');
    } catch (error) {
      this.addStep('百度搜索', 'failed', `搜索失败: ${error}`);
      throw error;
    }
  }

  /**
   * 步骤 2: 点击进入百度百科
   */
  async step2_OpenBaiduBaike() {
    console.log('📝 步骤 2: 打开百度百科页面\n');

    try {
      // 验证百科链接存在
      await this.agent.aiAssert('搜索结果中包含数字浙江百度百科的链接');
      this.addStep('验证百科链接', 'success', '找到百度百科链接');

      // 点击百度百科链接
      await this.agent.aiTap(
        '数字浙江百度百科链接 或 标题包含数字浙江的百度百科链接'
      );
      this.addStep('点击百科链接', 'success', '进入百度百科页面');

      // 等待页面加载
      await this.agent.aiWaitFor('百度百科页面已完全加载', {
        timeoutMs: 15000,
      });

      // 记录当前页面 URL
      this.testResult.pageUrl = this.page.url();
      console.log(`📄 当前页面: ${this.testResult.pageUrl}\n`);

      this.addStep('百科页面加载', 'success', '百度百科页面加载完成');
      console.log('✅ 步骤 2 完成: 成功进入百度百科\n');
    } catch (error) {
      this.addStep('打开百度百科', 'failed', `打开失败: ${error}`);
      throw error;
    }
  }

  /**
   * 步骤 3: 智能查找统一社会信用代码（带滚动）
   */
  async step3_FindCreditCode() {
    console.log('📝 步骤 3: 查找统一社会信用代码（智能滚动）\n');

    let found = false;
    let scrollCount = 0;

    try {
      // 循环滚动直到找到或达到最大尝试次数
      while (!found && scrollCount < this.maxScrollAttempts) {
        console.log(`🔍 第 ${scrollCount + 1}/${this.maxScrollAttempts} 次查找...\n`);

        // 检查当前视野内是否有信用代码
        try {
          const isVisible = await this.agent.aiQuery<boolean>(
            '判断当前页面是否显示了"统一社会信用代码"字段，返回 true 或 false'
          );

          if (isVisible) {
            found = true;
            this.addStep(
              '找到信用代码',
              'success',
              `第 ${scrollCount + 1} 次尝试找到`
            );
            console.log('✅ 找到统一社会信用代码字段\n');
            break;
          }
        } catch (queryError) {
          console.log('⚠️  当前视野内未找到，继续滚动...\n');
        }

        // 如果未找到，向下滚动
        if (!found && scrollCount < this.maxScrollAttempts - 1) {
          console.log('⬇️  向下滚动页面...\n');

          // 使用 Midscene 的智能滚动
          await this.agent.aiScroll({
            direction: 'down',
            distance: 800, // 每次滚动 800 像素
          });

          scrollCount++;
          await this.page.waitForTimeout(1500); // 等待页面稳定
        } else {
          scrollCount++;
        }
      }

      if (!found) {
        throw new Error(
          `滚动 ${this.maxScrollAttempts} 次后仍未找到统一社会信用代码`
        );
      }

      console.log('✅ 步骤 3 完成: 定位到统一社会信用代码\n');
    } catch (error) {
      this.addStep('查找信用代码', 'failed', `查找失败: ${error}`);
      throw error;
    }
  }

  /**
   * 步骤 4: 提取统一社会信用代码
   */
  async step4_ExtractCreditCode() {
    console.log('📝 步骤 4: 提取统一社会信用代码\n');

    try {
      // 使用 AI 提取信用代码数据
      const creditCodeData = await this.agent.aiQuery<CreditCodeData>(
        `从当前页面中提取"统一社会信用代码"的值。
        返回 JSON 格式:
        {
          "creditCode": "统一社会信用代码的具体数值",
          "organizationName": "组织名称（如果有）",
          "foundLocation": "找到信用代码的页面位置描述"
        }
        如果找不到，返回 {"creditCode": null, "error": "未找到"}`
      );

      console.log('📊 提取结果:', JSON.stringify(creditCodeData, null, 2), '\n');

      if (!creditCodeData.creditCode) {
        throw new Error('未能提取到统一社会信用代码');
      }

      // 验证信用代码格式（统一社会信用代码应为18位）
      const creditCode = creditCodeData.creditCode.trim();
      if (creditCode.length !== 18) {
        console.warn(
          `⚠️  信用代码长度异常: ${creditCode.length} 位（标准为18位）`
        );
      }

      // 保存到测试结果
      this.testResult.creditCode = creditCode;
      this.testResult.success = true;

      this.addStep(
        '提取信用代码',
        'success',
        `成功提取: ${creditCode}`
      );

      console.log(`✅ 步骤 4 完成: 信用代码提取成功\n`);
      console.log(`🔑 统一社会信用代码: ${creditCode}\n`);

      return creditCodeData;
    } catch (error) {
      this.addStep('提取信用代码', 'failed', `提取失败: ${error}`);
      throw error;
    }
  }

  /**
   * 步骤 5: 截图保存
   */
  async step5_TakeScreenshot() {
    console.log('📝 步骤 5: 截图保存\n');

    try {
      // Midscene 会自动在报告中包含每个步骤的截图
      // 这里额外保存一张完整截图
      const screenshotDir = path.join(
        process.cwd(),
        'midscene_run',
        'screenshots'
      );

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(
        screenshotDir,
        `数字浙江_${timestamp}.png`
      );

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true, // 全页截图
      });

      this.testResult.screenshotPath = screenshotPath;
      this.addStep('截图保存', 'success', `截图已保存: ${screenshotPath}`);

      console.log(`📸 截图已保存: ${screenshotPath}\n`);
      console.log('✅ 步骤 5 完成: 截图保存成功\n');
    } catch (error) {
      this.addStep('截图保存', 'failed', `截图失败: ${error}`);
      console.warn('⚠️  截图保存失败，但不影响测试结果\n');
    }
  }

  /**
   * 步骤 6: 生成测试报告
   */
  async step6_GenerateReport() {
    console.log('📝 步骤 6: 生成测试报告\n');

    try {
      // 更新时间戳
      this.testResult.timestamp = new Date().toISOString();

      // Midscene 会自动生成 HTML 报告
      // 报告路径会在控制台输出

      // 额外生成 JSON 格式的测试结果
      const reportDir = path.join(process.cwd(), 'midscene_run', 'reports');
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join(
        reportDir,
        `数字浙江测试结果_${timestamp}.json`
      );

      fs.writeFileSync(reportPath, JSON.stringify(this.testResult, null, 2));

      console.log(`📄 JSON 报告已保存: ${reportPath}\n`);
      console.log('✅ 步骤 6 完成: 测试报告生成成功\n');

      this.addStep('生成报告', 'success', `报告已保存: ${reportPath}`);
    } catch (error) {
      this.addStep('生成报告', 'failed', `报告生成失败: ${error}`);
      console.warn('⚠️  额外报告生成失败，但 Midscene HTML 报告仍会生成\n');
    }
  }

  /**
   * 清理: 关闭浏览器
   */
  async teardown() {
    console.log('🛑 清理测试环境...\n');
    if (this.browser) {
      await this.browser.close();
    }
    console.log('✅ 测试环境清理完成\n');
  }

  /**
   * 辅助方法: 添加步骤记录
   */
  private addStep(
    stepName: string,
    status: 'success' | 'failed' | 'skipped',
    message: string
  ) {
    this.testResult.steps.push({
      stepName,
      status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 获取测试结果
   */
  getTestResult(): TestResult {
    return this.testResult;
  }

  /**
   * 打印测试摘要
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 测试执行摘要');
    console.log('='.repeat(60));
    console.log(`测试状态: ${this.testResult.success ? '✅ 成功' : '❌ 失败'}`);
    console.log(`统一社会信用代码: ${this.testResult.creditCode || '未提取'}`);
    console.log(`页面 URL: ${this.testResult.pageUrl}`);
    console.log(`截图路径: ${this.testResult.screenshotPath || '无'}`);
    console.log(`执行时间: ${this.testResult.timestamp}`);
    console.log(`总步骤数: ${this.testResult.steps.length}`);
    console.log(`成功步骤: ${this.testResult.steps.filter(s => s.status === 'success').length}`);
    console.log(`失败步骤: ${this.testResult.steps.filter(s => s.status === 'failed').length}`);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * 主函数: 执行完整测试流程
 */
async function main() {
  const test = new DigitalZhejiangCreditCodeTest();

  try {
    // ========== 执行测试 ==========
    await test.setup(); // 初始化
    await test.step1_BaiduSearch(); // 百度搜索
    await test.step2_OpenBaiduBaike(); // 打开百科
    await test.step3_FindCreditCode(); // 查找信用代码
    await test.step4_ExtractCreditCode(); // 提取信用代码
    await test.step5_TakeScreenshot(); // 截图
    await test.step6_GenerateReport(); // 生成报告

    // 打印测试摘要
    test.printSummary();

    console.log('🎉 测试执行成功！\n');
    console.log('📄 查看 Midscene HTML 报告获取完整的截图和执行详情\n');
  } catch (error) {
    console.error('\n❌ 测试执行失败:', error);
    test.printSummary();
    throw error;
  } finally {
    // 清理
    await test.teardown();
  }
}

// ========== 导出和执行 ==========
if (require.main === module) {
  main().catch((error) => {
    console.error('测试执行出错:', error);
    process.exit(1);
  });
}

export { DigitalZhejiangCreditCodeTest };
