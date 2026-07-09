import {test, expect} from '@playwright/test';
import { API_ENDPOINTS_PATTERN } from '../constants/api.ts';
import { mockRoute } from '../helpers/mockRoute.ts';
import { MOCK_ONE_PRODUCT_RESPONSE } from '../constants/mockApiResponses.ts';
import { ROUTES } from '../constants/routes.ts';
import { getAllPrices } from '../helpers/getAllPrices.ts';
import { getCatalogLocator } from '../constants/locators.ts';

test('Проверка сортировки по возрастанию текущая страница', async ({ page }) => {
  await page.goto(ROUTES.catalog);

  const { sortDefault, sortAsc} = getCatalogLocator(page);
  await sortDefault.click();
  await sortAsc.click();

  const productPricesSelector = '[data-testid^="catalog-product-price-prod-"]';

  await page.waitForSelector(productPricesSelector)
  const priceLocator = page.locator(productPricesSelector)

  const priceElements = await priceLocator.all();
  const prices: number[] = await getAllPrices(priceElements); // думаю, тут стоит дополнительно рассмотреть цену ноль или когда цены вообще нет - считать ли эти случаи это ошибкой. Потому что если считать, то нужно проверочки добавить и изменить функцию. Пока не ясно. Но текущая реализация не покрывает это, тест не упадет

  for(let i = 0; i < prices.length -1; i++) {
    expect.soft(prices[i]).toBeLessThanOrEqual(prices[i+1])
  }
});

test('Проверка сортировки по возрастанию все страницы', async ({ page }) => {
  await page.goto(ROUTES.catalog);

  const { sortDefault, sortAsc, nextPageBtn} = getCatalogLocator(page);
  await sortDefault.click();
  await sortAsc.click();

  let lastPrice = 0;
  let currentPage = 1;
  let hasNextPage = true;

  const productPricesSelector = '[data-testid^="catalog-product-price-prod-"]';
  const priceLocator = page.locator(productPricesSelector);

  await page.waitForSelector(productPricesSelector);

  while (hasNextPage) {
    const priceElements = await priceLocator.all()
    const prices: number[] = await getAllPrices(priceElements);

    expect.soft(lastPrice).toBeLessThanOrEqual(prices[0])

    for (let i = 0; i < prices.length - 1; i++) {
      expect.soft(prices[i]).toBeLessThanOrEqual(prices[i + 1])
    }

    const isNextPageDisabled = await nextPageBtn.isDisabled();

    if (isNextPageDisabled) {
        hasNextPage = false;
    } else {
        await nextPageBtn.click()
        await page.waitForSelector(productPricesSelector)
    }

    lastPrice = prices[prices.length - 1]
    currentPage++;
  }
});

test('Проверка отображения 1 товара', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS_PATTERN.product, status: 200, body: MOCK_ONE_PRODUCT_RESPONSE})

  await page.goto(ROUTES.catalog);

  const productCardSelector = '[data-testid^="catalog-product-card-prod-"]';

  await page.waitForSelector(productCardSelector);
  const count = await page.locator(productCardSelector).count();
  expect.soft(count).toEqual(1)
});

test('Проверка сортировки по убыванию со всех страниц по отдельности', async ({ page }) => {
  await page.goto(ROUTES.catalog);

  const { sortDefault, sortDesc, nextPageBtn} = getCatalogLocator(page);
  await sortDefault.click();
  await sortDesc.click();

  let lastPriceOnPrevPage = 0;
  let currentPage = 1;
  let hasNextPage = true;

  const productPricesSelector = '[data-testid^="catalog-product-price-prod-"]';
  const priceLocator = page.locator(productPricesSelector);

  await page.waitForSelector(productPricesSelector);

  while (hasNextPage) {
    const priceElements = await priceLocator.all()
    const catalogActivePage = page.getByTestId(`catalog-pagination-page-${currentPage}`);

    await expect(catalogActivePage).toHaveAttribute('aria-current', 'page'); // вот этим воспользовалась https://playwright.help/docs/next/api/class-locatorassertions#locator-assertions-to-have-attribute проверяем, что текущая  страница с нужным нлмером - активная

    const prices: number[] = await getAllPrices(priceElements);

    const firstPriceOnCurrentPage = prices[0];

    if (currentPage > 1) {
      expect.soft(lastPriceOnPrevPage).toBeGreaterThanOrEqual(firstPriceOnCurrentPage);
    }

    for (let i = 0; i < prices.length - 1; i++) {
        expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i+1])
    }

    lastPriceOnPrevPage = prices[prices.length-1];

    const isNextPageBtnDisabled = await nextPageBtn.isDisabled();

    if (isNextPageBtnDisabled) {
        hasNextPage = false;
    } else {
      currentPage++;
      await nextPageBtn.click();
      await page.waitForSelector(productPricesSelector);
    }
  }
});


test('Проверка сортировки по убыванию со всех страниц сразу', async ({ page }) => {
  await page.goto(ROUTES.catalog);

  const { sortDefault, sortDesc, nextPageBtn} = getCatalogLocator(page);
  await sortDefault.click();
  await sortDesc.click();

  let hasNextPage = true;

  const productPricesSelector = '[data-testid^="catalog-product-price-prod-"]';
  const priceLocator = page.locator(productPricesSelector);
  const prices: number[] = []

  await page.waitForSelector(productPricesSelector);

  while (hasNextPage) {
    const priceElements = await priceLocator.all()

    prices.push(...await getAllPrices(priceElements));

    const isNextPageBtnDisabled = await nextPageBtn.isDisabled();

    if (isNextPageBtnDisabled) {
        hasNextPage = false;
    } else {
      await nextPageBtn.click();
      await page.waitForSelector(productPricesSelector);
    }
  }

  for (let i = 0; i < prices.length - 1; i++) {
    expect.soft(prices[i]).toBeGreaterThanOrEqual(prices[i+1])
  }
});

test('Проверка сортировки по возрастанию со всех страниц сразу', async ({ page }) => {
  await page.goto(ROUTES.catalog);

  const { sortDefault, sortAsc, nextPageBtn} = getCatalogLocator(page);
  await sortDefault.click();
  await sortAsc.click();

  let hasNextPage = true;

  const productPricesSelector = '[data-testid^="catalog-product-price-prod-"]';
  const priceLocator = page.locator(productPricesSelector);
  const prices: number[] = []

  await page.waitForSelector(productPricesSelector);

  while (hasNextPage) {
    const priceElements = await priceLocator.all()

    prices.push(...await getAllPrices(priceElements));

    const isNextPageBtnDisabled = await nextPageBtn.isDisabled();

    if (isNextPageBtnDisabled) {
        hasNextPage = false;
    } else {
      await nextPageBtn.click();
      await page.waitForSelector(productPricesSelector);
    }
  }

  for (let i = 0; i < prices.length - 1; i++) {
    expect.soft(prices[i]).toBeLessThanOrEqual(prices[i+1])
  }
});

