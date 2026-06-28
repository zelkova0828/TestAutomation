import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const targetProject = process.env.TARGET_PROJECT?.trim();
if (!targetProject) {
  throw new Error('環境変数 TARGET_PROJECT が設定されていません。例: TARGET_PROJECT=sample_project');
}

const projectDir = path.resolve(__dirname, 'projects', targetProject);
if (!fs.existsSync(projectDir)) {
  throw new Error(`指定されたプロジェクトディレクトリが存在しません: ${projectDir}`);
}

// プロジェクトごとの設定ファイルを読み込む (オプション)
let projectConfig: { baseURL?: string } = {};
const configPath = path.join(projectDir, 'config.json');
if (fs.existsSync(configPath)) {
  try {
    projectConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    console.error(`設定ファイルの読み込みに失敗しました: ${configPath}`, e);
  }
}

export default defineConfig({
  testDir: path.join(projectDir, 'tests'),
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  outputDir: path.join(projectDir, 'test-results', 'run-artifacts'),
  reporter: [
    ['html', { outputFolder: path.join(projectDir, 'test-results', 'html-report'), open: 'never' }],
    ['json', { outputFile: path.join(projectDir, 'test-results', 'report.json') }],
    ['list']
  ],
  use: {
    baseURL: projectConfig.baseURL || undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
