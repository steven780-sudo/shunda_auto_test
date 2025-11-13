/**
 * Midscene 标准测试用例 - TypeScript 版本
 * 百度搜索功能自动化测试
 *
 * 运行方式:
 * 1. 确保 .env 已配置 API 密钥
 * 2. 执行: npx ts-node baidu_test_example.ts
 * 或使用 Vitest: npx vitest run baidu_test_example.test.ts
 */

import { PuppeteerAgent } from '@midscene/web/puppeteer';
import puppeteer, { Browser, Page } from 'puppeteer';

// 测试数据类型定义
interface SearchResult {
  title: string;
  url: string;
  description: string;
}

interface HotSearchItem {
  rank: number;
  title: string;
  hotValue?: string;
}

interface ImageResult {
  alt: string;
  size?: string;
}

/**
 * 测试类: 百度搜索功能测试
 */
class BaiduSearchTest {
  private browser!: Browser;
  private page!: Page;
  private agent!: PuppeteerAgent;

  /**
   * 初始化: 启动浏览器和创建 Agent
   */
  async setup() {
    console.log('🚀 启动浏览器...');

    this.browser = await puppeteer.launch({
      headless: false, // 设置为 true 可无头模式
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: [
        '--disable-blink-features=AutomationControlled', // 反爬虫检测
        '--no-sandbox',
      ],
    });

    this.page = await this.browser.newPage();

    // 创建 Midscene Agent
    this.agent = new PuppeteerAgent(this.page, {
      generateReport: true, // 生成测试报告
      autoPrintReportMsg: true, // 自动打印报告路径
      groupName: '百度搜索功能测试',
      groupDescription: '使用 Midscene AI 自动化测试百度搜索各项功能',
      cache: {
        enabled: true, // 启用缓存加速测试
        id: 'baidu-search-test',
        strategy: 'read-write',
      },
    });

    console.log('✅ 浏览器启动成功');
  }

  /**
   * 清理: 关闭浏览器
   */
  async teardown() {
    console.log('🛑 关闭浏览器...');
    if (this.browser) {
      await this.browser.close();
    }
    console.log('✅ 测试完成');
  }

  /**
   * 测试 1: 基础搜索流程
   */
  async testBasicSearch() {
    console.log('\n📝 测试 1: 基础搜索流程');

    // 步骤 1: 访问百度首页
    await this.page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
    });

    // 步骤 2: 验证页面加载
    await this.agent.aiAssert('页面已完全加载,显示百度搜索框');

    // 步骤 3: 输入搜索关键词
    await this.agent.aiInput('搜索输入框', {
      value: 'Midscene.js AI 自动化',
    });

    // 步骤 4: 点击搜索按钮
    await this.agent.aiTap('百度一下按钮');

    // 步骤 5: 等待搜索结果
    await this.agent.aiWaitFor('搜索结果列表已显示', {
      timeoutMs: 10000,
    });

    // 步骤 6: 提取搜索结果 (使用 TypeScript 类型)
    const searchResults = await this.agent.aiQuery<SearchResult[]>(
      `提取前5条搜索结果,返回 JSON 数组,每项包含:
       - title: 标题文字
       - url: 链接地址
       - description: 摘要描述`
    );

    console.log('📊 搜索结果:', JSON.stringify(searchResults, null, 2));

    // 步骤 7: 验证搜索结果
    await this.agent.aiAssert('搜索结果中至少有一条包含 Midscene 关键词');

    console.log('✅ 测试 1 通过');
  }

  /**
   * 测试 2: 热搜榜数据提取
   */
  async testHotSearch() {
    console.log('\n📝 测试 2: 百度热搜榜数据提取');

    // 步骤 1: 返回首页
    await this.page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
    });

    // 步骤 2: 提取热搜榜
    const hotSearchList = await this.agent.aiQuery<HotSearchItem[]>(
      `提取百度热搜榜的前10条数据,返回 JSON 数组,每项包含:
       - rank: 排名 (数字)
       - title: 热搜标题
       - hotValue: 热度值 (如果显示的话)`
    );

    console.log('🔥 热搜榜:', JSON.stringify(hotSearchList, null, 2));

    // 步骤 3: 验证数据完整性
    if (hotSearchList.length < 5) {
      throw new Error(`热搜榜数据不足,仅获取到 ${hotSearchList.length} 条`);
    }

    // 步骤 4: 点击第一条热搜
    await this.agent.aiTap('热搜榜第一条');

    // 步骤 5: 验证跳转
    await this.agent.aiWaitFor('页面已跳转到搜索结果页', {
      timeoutMs: 5000,
    });

    console.log('✅ 测试 2 通过');
  }

  /**
   * 测试 3: 图片搜索流程 (复杂交互)
   */
  async testImageSearch() {
    console.log('\n📝 测试 3: 图片搜索流程');

    // 步骤 1: 返回首页
    await this.page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
    });

    // 步骤 2: 点击图片搜索入口
    await this.agent.aiTap('图片搜索链接或入口');

    // 步骤 3: 等待页面加载
    await this.agent.aiWaitFor('图片搜索页面已加载完成', {
      timeoutMs: 10000,
    });

    // 步骤 4: 输入搜索关键词
    await this.agent.aiInput('图片搜索输入框', {
      value: '风景壁纸',
    });

    // 步骤 5: 执行搜索
    await this.agent.aiTap('搜索按钮');

    // 步骤 6: 等待图片加载
    await this.agent.aiWaitFor('至少显示了10张图片', {
      timeoutMs: 15000,
    });

    // 步骤 7: 提取图片信息
    const imageResults = await this.agent.aiQuery<ImageResult[]>(
      `提取前5张图片的信息,返回 JSON 数组,每项包含:
       - alt: 图片描述文字
       - size: 图片尺寸 (如果显示)`
    );

    console.log('🖼️  图片搜索结果:', JSON.stringify(imageResults, null, 2));

    // 步骤 8: 点击第一张图片
    await this.agent.aiTap('第一张图片');

    // 步骤 9: 验证大图显示
    await this.agent.aiAssert('大图预览窗口已打开');

    console.log('✅ 测试 3 通过');
  }

  /**
   * 测试 4: 边界情况测试
   */
  async testEdgeCases() {
    console.log('\n📝 测试 4: 边界情况测试');

    // 场景 1: 空搜索测试
    await this.page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
    });

    await this.agent.aiTap('百度一下按钮');
    await this.agent.aiAssert(
      '输入框提示 请输入搜索内容 或保持在当前页面'
    );

    // 场景 2: 特殊字符搜索
    await this.agent.aiInput('搜索输入框', {
      value: 'C++ @ 编程 #教程',
    });

    await this.agent.aiTap('百度一下按钮');

    await this.agent.aiWaitFor('搜索结果页面加载完成', {
      timeoutMs: 10000,
    });

    await this.agent.aiAssert('搜索结果中包含相关编程教程内容');

    console.log('✅ 测试 4 通过');
  }

  /**
   * 高级用法: 使用 aiAction 自动规划
   * 注意: aiAction 会让 AI 自动规划步骤,适合复杂任务
   */
  async testAdvancedAction() {
    console.log('\n📝 高级测试: 使用 aiAction 自动规划');

    await this.page.goto('https://www.baidu.com', {
      waitUntil: 'networkidle2',
    });

    // AI 会自动规划以下步骤:
    // 1. 找到搜索框
    // 2. 输入关键词
    // 3. 点击搜索按钮
    // 4. 等待结果加载
    await this.agent.aiAction(
      '搜索 "人工智能" 并等待搜索结果加载完成'
    );

    // 验证结果
    const resultCount = await this.agent.aiQuery<string>(
      '获取搜索结果数量的文字描述'
    );

    console.log('🔍 搜索结果数量:', resultCount);
    console.log('✅ 高级测试通过');
  }
}

/**
 * 主函数: 执行所有测试
 */
async function main() {
  const test = new BaiduSearchTest();

  try {
    // 初始化
    await test.setup();

    // 执行测试 (可以选择性执行)
    await test.testBasicSearch(); // 基础搜索
    await test.testHotSearch(); // 热搜榜
    // await test.testImageSearch();      // 图片搜索 (耗时较长)
    // await test.testEdgeCases();        // 边界情况
    await test.testAdvancedAction(); // 高级用法

    console.log('\n🎉 所有测试通过!');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    throw error;
  } finally {
    // 清理
    await test.teardown();
  }
}

// 运行测试
if (require.main === module) {
  main().catch((error) => {
    console.error('测试执行出错:', error);
    process.exit(1);
  });
}

export { BaiduSearchTest };
