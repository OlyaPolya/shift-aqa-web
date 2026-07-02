import {test, expect} from '@playwright/test';
import config from '../playwright.config.ts';

const baseURL = config.use?.baseURL;

if (!baseURL) {
  throw new Error('baseURL не задан в конфигурации');
}

test('Проверка перехода на Главную страницу', async ({page}) => {
  await page.goto('');
  await expect.soft(page).toHaveTitle('Главная');
  await expect.soft(page).toHaveURL(baseURL);
})

test('Проверка перехода на страницу Каталог', async ({page}) => {
  await page.goto('catalog');
  await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
  await expect.soft(page).toHaveURL(`${baseURL}catalog`);
})

test('Проверка URL на странице Каталог (regex)', async ({page}) => {
  await page.goto('catalog');
  await expect.soft(page).toHaveURL(/.*catalog/);
})

test('Проверка текста кнопки "Перейти в каталог"', async ({page}) => {
  await page.goto('');
  await expect.soft(page.getByTestId('home-hero-catalog-button')).toHaveText('Перейти в каталог');
  await expect.soft(page.getByTestId('home-hero-catalog-button')).toContainText('каталог');
})

test('Проверка ссылки в логотипе (Хедер)', async ({page}) => {
  await page.goto('catalog');
  await expect.soft(page.getByTestId('header-logo')).toHaveAttribute('href', '/');
})

test('Проверка ссылки в логотипе и переход по ссылке (Хедер)', async ({page}) => {
  await page.goto('catalog');
  await page.getByTestId('header-logo').click();
  await expect.soft(page).toHaveTitle('Главная');
  await expect.soft(page).toHaveURL(baseURL);
})

test.skip('Проверка перехода в каталоге по кнопке Конфеты', async ({page}) => {
  await page.goto('');
  await page.getByTestId('home-category-candy').click();
  await expect.soft(page).toHaveTitle('СладкийДом - Интернет-магазин сладостей');
  await expect.soft(page).toHaveURL(`${baseURL}catalog?category=candy`);
  await page.waitForTimeout(100);
  await page.waitForSelector('[data-testid^="catalog-product-category-prod-"]');
  const categoryItems = page.locator('[data-testid^="catalog-product-category-prod-"]');
  const itemsCount = await categoryItems.count();
  for (let i = 0; i < itemsCount; i++) {
    const categoryText = await categoryItems.nth(i).textContent();
    expect.soft(categoryText).toBe('Конфеты');
  }
})

test('Проверка закрытия плашки cookie', async ({page}) => {
  await page.goto('');
  await expect.soft(page.getByTestId('cookie-consent-banner')).toBeVisible();
  await page.getByTestId('cookie-accept-button').click();
  await expect.soft(page.getByTestId('cookie-consent-banner')).toBeHidden();
})
