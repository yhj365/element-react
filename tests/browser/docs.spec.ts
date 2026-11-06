import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const catalog = JSON.parse(
  readFileSync(new URL('../../docs/src/generated/catalog.json', import.meta.url), 'utf8'),
) as { components: Array<{ id: string; title: string; examples: unknown[]; api: unknown[] }> };

test('源码高亮折叠、语言记忆与 Slider 键盘提交', async ({ page }) => {
  await page.goto('/#/components/slider');
  const demo = page.locator('#slider-basic-usage');
  await demo.getByRole('button', { name: '查看代码', exact: true }).click();
  await expect(demo.locator('pre .token.keyword').first()).toBeVisible();
  await expect(demo.locator('pre')).toContainText('import { Slider }');
  await demo.locator('.code-collapse').click();
  await expect(demo.locator('pre')).toHaveCount(0);
  const slider = demo.getByRole('slider', { name: 'Default value', exact: true });
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('1');
  await page.getByRole('combobox', { name: '语言', exact: true }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Slider');
  await expect(page).toHaveURL(/components\/slider/);
  await demo.getByRole('button', { name: 'View code', exact: true }).click();
  await page.screenshot({ path: 'output/playwright/docs-slider-en-code.png' });
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveValue('en');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'output/playwright/docs-slider-en-mobile.png' });
});

test('所有公开组件文档和运行示例都能加载', async ({ page }) => {
  test.setTimeout(300000);
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  for (const component of catalog.components) {
    await page.goto(`/#/components/${component.id}`);
    await expect(page.locator('h1')).toHaveText(component.title);
    await expect(page.locator('.demo-preview')).toHaveCount(component.examples.length);
    await expect(page.getByText('示例加载失败，请刷新页面。')).toHaveCount(0);
    await expect(page.locator('.api-table tbody tr')).toHaveCount(component.api.length);
    await page.getByRole('button', { name: /完成记录与来源对照/ }).click();
    await expect(page.locator('.api-table tbody tr')).toHaveCount(component.api.length);
    await expect(page.locator('.api-table tbody .verified')).toHaveCount(component.api.length);
  }
  expect(failures).toEqual([]);
});

test('示例代码与交互可使用，完成项可搜索', async ({ page }) => {
  await page.goto('/#/components/input');
  const field = page.getByRole('textbox', { name: '基础输入', exact: true });
  await field.fill('React 19');
  await expect(page.getByText('当前值：React 19')).toBeVisible();
  await page.locator('#input-basic').getByRole('button', { name: '查看代码', exact: true }).click();
  await expect(page.locator('#input-basic pre')).toContainText('onValueChange');
  await page.goto('/#/components/switch');
  await page.getByRole('switch', { name: '启用通知', exact: true }).locator('..').click();
  await expect(page.getByRole('switch', { name: '启用通知', exact: true })).toBeChecked();
  await page.goto('/#/verification');
  await page.getByRole('textbox', { name: '检索完成项' }).fill('button');
  await expect(page.locator('.api-table tbody tr').first()).toBeVisible();
  await expect(page.getByText('未完成', { exact: true })).toHaveCount(0);
});

test('浅深主题和窄屏目录可操作且无页面横向溢出', async ({ page }) => {
  await page.goto('/#/components/button');
  const primary = page.locator('#button-variants .el-button--primary').first();
  await expect(primary).toHaveCSS('background-color', 'rgb(64, 158, 255)');
  await expect(primary).toHaveCSS('height', '32px');
  await expect(primary).not.toHaveClass(/is-link|is-circle|is-disabled/);
  await page.screenshot({ path: 'output/playwright/docs-button-light.png', fullPage: true });
  await page.getByRole('button', { name: '切换深色主题' }).click();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.screenshot({ path: 'output/playwright/docs-button-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '切换组件目录' }).click();
  await expect(page.locator('.sidebar')).toHaveClass(/is-open/);
  await page.locator('.sidebar').getByRole('link', { name: 'Input 输入框', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Input 输入框');
  await expect(page.locator('.sidebar')).not.toHaveClass(/is-open/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'output/playwright/docs-input-mobile.png', fullPage: true });
});

test('选择器、验证码和消息确认的浏览器交互', async ({ page }) => {
  await page.goto('/#/components/select');
  const input = page.getByRole('combobox', { name: '城市' });
  await input.click();
  await page.getByRole('option', { name: '北京', exact: true }).click();
  await expect(page.locator('#select-basic .el-select__placeholder')).toHaveText('北京');
  await input.click();
  await input.fill('上海');
  await expect(page.locator('.el-select__popper').getByRole('option')).toHaveCount(1);
  await page.getByRole('option', { name: '上海', exact: true }).click();
  await page.screenshot({ path: 'output/playwright/docs-select.png', fullPage: true });
  await page.goto('/#/components/input-otp');
  await page.locator('#input-otp-basic input').first().fill('012345');
  await expect(page.locator('#input-otp-basic')).toContainText('完成输入：012345');
  await page.goto('/#/components/message-box');
  await page.getByRole('button', { name: '确认操作', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '确定', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#message-box-basic')).toContainText('已确认');
  await page.goto('/#/components/watermark');
  const mark = page.locator('#watermark-basic .demo-preview [aria-hidden="true"]');
  await expect(mark).toHaveCSS('background-image', /data:image\/png;base64/);
  await page.screenshot({ path: 'output/playwright/docs-watermark.png', fullPage: true });
  await page.goto('/#/components/input-tag');
  const tags = page.locator('#input-tag-basic .el-tag');
  await tags.first().dragTo(tags.nth(1));
  await expect(tags.first()).toContainText('TypeScript');
  const tagInput = page.getByRole('textbox', { name: '项目标签' });
  await tagInput.fill('Element');
  await tagInput.press('Enter');
  await expect(tagInput).toHaveCSS('outline-style', 'none');
  await expect(tags).toHaveCount(3);
  await page
    .locator('#input-tag-basic .demo-frame')
    .screenshot({ path: 'output/playwright/input-tag-example.png' });
  await page.goto('/#/components/carousel');
  await page.locator('#carousel-basic').getByRole('button', { name: '切换至第 2 张幻灯片' }).click();
  await expect(page.locator('#carousel-basic .el-carousel__item.is-active')).toContainText('第二屏');
  await expect(page.locator('#carousel-basic .el-carousel__item.is-active')).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, 0)',
  );
  await page.screenshot({ path: 'output/playwright/docs-carousel.png', fullPage: false });
  await page.goto('/#/components/time-select');
  await page.getByRole('combobox', { name: '会议时间' }).click();
  await expect(page.getByRole('option', { name: '09:00', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.getByRole('option', { name: '09:15', exact: true }).click();
  await expect(page.locator('#time-select-basic .el-select__placeholder')).toHaveText('09:15');
});
