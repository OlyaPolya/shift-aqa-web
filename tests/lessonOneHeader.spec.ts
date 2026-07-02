import {test, expect} from '@playwright/test';
import config from '../playwright.config.ts';

/*
Я бы еще разделила тесты на виды устройств (mobile, desktop) потому что верстка отличается.
Нам пока что не рассказывали как разделить на девайсы (да и в ДЗ говорилось об использовании материалов практики «Автотестирование с Playwright и TypeScript»), поэтому не хватает тестов для меню бургера и наличие/отсутствие элементов в зависимости от девайса
*/

const baseURL = config.use?.baseURL;

if (!baseURL) {
  throw new Error('baseURL не задан в конфигурации');
}

test('Проверка наличия логотипа, ссылки и перехода в логотипе (Хедер)', async ({page}) => {
  await page.goto('');

  const logo = page.getByTestId('header-logo')

  await expect.soft(logo).toBeVisible();
  await expect.soft(logo).toContainText('СладкийДом');
  await expect.soft(logo).toHaveAttribute('href', '/');
  await logo.click();
  await expect.soft(page).toHaveURL(baseURL);
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Главная" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const mainElement = page.getByTestId('header-nav-link-home');

  await expect.soft(mainElement).toBeVisible();
  await expect.soft(mainElement).toHaveText('Главная');
  await expect.soft(mainElement).toHaveAttribute('href', '/');
  await mainElement.click();
  await expect.soft(page).toHaveURL(baseURL);
  await expect.soft(page).toHaveTitle('Главная | СладкийДом');  // на бою у этой страницы <title>Главная</title>, но судя по другим страницам, title должен содержать дополнительный текст ' | СладкийДом'. Тест падает
  await expect.soft(page.getByTestId('catalog-title')).toHaveText('Добро пожаловать в СладкийДом');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Каталог" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const catalogElement = page.getByTestId('header-nav-link-catalog');

  await expect.soft(catalogElement).toBeVisible();
  await expect.soft(catalogElement).toHaveText('Каталог');
  await expect.soft(catalogElement).toHaveAttribute('href', '/catalog');
  await catalogElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}catalog`);
  await expect.soft(page).toHaveTitle('Каталог | СладкийДом'); // на бою у этой страницы <title>СладкийДом - Интернет-магазин сладостей</title>, поэтому тест падает. Одинаковые тайтлы хуже для seo
  await expect.soft(page.getByTestId('home-hero-title')).toHaveText('Каталог сладостей');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Акции" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const promotionElement = page.getByTestId('header-nav-link-promotions');

  await expect.soft(promotionElement).toBeVisible();
  await expect.soft(promotionElement).toHaveText('Акции');
  await expect.soft(promotionElement).toHaveAttribute('href', '/promotions');
  await promotionElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}promotions`);
  await expect.soft(page).toHaveTitle('Акции | СладкийДом');
  await expect.soft(page.getByTestId('promotions-title')).toHaveText('Акции и специальные предложения');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Доставка" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const deliveryElement = page.getByTestId('header-nav-link-delivery');

  await expect.soft(deliveryElement).toBeVisible();
  await expect.soft(deliveryElement).toHaveText('Доставка');
  await expect.soft(deliveryElement).toHaveAttribute('href', '/delivery');
  await deliveryElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}delivery`);
  await expect.soft(page).toHaveTitle('Доставка и оплата | СладкийДом');
  await expect.soft(page.getByTestId('delivery-title')).toHaveText('Доставка и оплата');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "О нас" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const aboutElement = page.getByTestId('header-nav-link-about');

  await expect.soft(aboutElement).toBeVisible();
  await expect.soft(aboutElement).toHaveText('О нас');
  await expect.soft(aboutElement).toHaveAttribute('href', '/about');
  await aboutElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}about`);
  await expect.soft(page).toHaveTitle('О компании | СладкийДом');
  await expect.soft(page.getByTestId('about-title')).toHaveText('О компании');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Контакты" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const aboutElement = page.getByTestId('header-nav-link-contacts');

  await expect.soft(aboutElement).toBeVisible();
  await expect.soft(aboutElement).toHaveText('Контакты');
  await expect.soft(aboutElement).toHaveAttribute('href', '/contacts');
  await aboutElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}contacts`);
  await expect.soft(page).toHaveTitle('Контакты | СладкийДом');
  await expect.soft(page.getByTestId('contacts-title')).toHaveText('Контакты');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "Обратная связь" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const feedbackElement = page.getByTestId('header-nav-link-feedback');

  await expect.soft(feedbackElement).toBeVisible();
  await expect.soft(feedbackElement).toHaveText('Обратная связь');
  await expect.soft(feedbackElement).toHaveAttribute('href', '/feedback');
  await feedbackElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}feedback`);
  await expect.soft(page).toHaveTitle('Обратная связь | СладкийДом'); // на бою у этой страницы <title>СладкийДом - Интернет-магазин сладостей</title>, поэтому тест падает. Одинаковые тайтлы хуже для seo
  await expect.soft(page.getByTestId('feedback-title')).toHaveText('Обратная связь');
})

test('Проверка существования, ссылки и переход по ссылке элемента меню "FAQ" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const faqElement = page.getByTestId('header-nav-link-faq');

  await expect.soft(faqElement).toBeVisible();
  await expect.soft(faqElement).toHaveText('FAQ');
  await expect.soft(faqElement).toHaveAttribute('href', '/faq');
  await faqElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}faq`);
  await expect.soft(page).toHaveTitle('Частые вопросы | СладкийДом'); // на бою у этой страницы <title>СладкийДом - Интернет-магазин сладостей</title>, поэтому тест падает. Одинаковые тайтлы хуже для seo
  await expect.soft(page.getByTestId('faq-title')).toHaveText('Часто задаваемые вопросы');
})

test('Проверка элемента, ссылки  и переход по ссылке "Корзина" (Хедер, desktop)', async ({page}) => {
  await page.goto('');

  const cartElement = page.getByTestId('header-cart-link');

  await expect.soft(cartElement).toBeVisible();
  await expect.soft(cartElement).toHaveText('Корзина'); //визуально  текст Корзина скрыт, судя по классу, это спан только для скринридера. Нужно добавить проверку того, что визуально элемент не виден. Тестового id нет
  await expect.soft(cartElement).toHaveAttribute('href', '/cart');
  await cartElement.click();
  await expect.soft(page).toHaveURL(`${baseURL}cart`);
  await expect.soft(page).toHaveTitle('Корзина | СладкийДом'); // на бою у этой страницы <title>СладкийДом - Интернет-магазин сладостей</title>, поэтому тест падает. Одинаковые тайтлы хуже для seo
  await expect.soft(page.getByTestId('cart-title')).toHaveText('Корзина');
})

test('Проверка отсутствия элемента бургер меню "Открыть меню" в desktop версии (Хедер)', async ({page}) => {
  await page.goto('');
  await expect.soft(page.getByTestId('header-burger-menu-button')).toBeHidden();
})

