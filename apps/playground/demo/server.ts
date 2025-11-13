import { playgroundForAgent } from '@midscene/playground';
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config({
  path: '../../.env',
});

async function main() {
  console.log('🚀 Starting Playground Demo Server...');

  // Launch Puppeteer browser directly
  const browser = await puppeteer.launch({
    headless: false, // 改为 false，可以看到浏览器界面
    defaultViewport: null,
    executablePath: undefined, // Let puppeteer find Chrome automatically
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // 防止被识别为自动化
    ],
  });

  const puppeteerPage = await browser.newPage();

  // 设置更长的超时时间，防止页面导航时超时
  puppeteerPage.setDefaultNavigationTimeout(60000); // 60秒
  puppeteerPage.setDefaultTimeout(30000); // 30秒

  // Navigate to the test page
  await puppeteerPage.goto(
    'https://www.baidu.com',
    { waitUntil: 'networkidle2' } // 等待网络空闲
  );

  await puppeteerPage.setViewport({
    width: 1920, // 改为更大的视口
    height: 1080,
  });

  // Create the agent with the Puppeteer page
  const agent = new PuppeteerAgent(puppeteerPage, {
    cacheId: 'playground-demo-test',
  });

  // Launch playground server with CORS enabled for playground app
  const server = await playgroundForAgent(agent).launch({
    port: 5870, // Use different port from web-integration demo
    openBrowser: false, // Don't open browser automatically
    verbose: true,
    enableCors: true,
  });

  console.log(`✅ Playground Demo Server started on port ${server.port}`);
  console.log(`🔑 Server ID: ${server.server.id}`);
  console.log(
    '🌐 You can now start the playground app and it will connect to this server',
  );
  console.log('');
  console.log('To start the playground app:');
  console.log('  cd apps/playground && npm run dev');
  console.log('');
  console.log('To stop this demo server, press Ctrl+C');

  // Keep the process running
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down demo server...');
    await server.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start demo server:', err);
  process.exit(1);
});
