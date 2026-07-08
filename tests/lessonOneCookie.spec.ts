import {test, expect} from '@playwright/test';
import config from '../playwright.config.ts';

const baseURL = config.use?.baseURL;

if (!baseURL) {
  throw new Error('baseURL не задан в конфигурации');
}

test('Проверка плашки cookie', async ({page}) => {
  await page.goto('');

  const cookieBanner = page.getByTestId('cookie-consent-banner');
  const acceptCookieBtn = page.getByTestId('cookie-accept-button');
  const declineCookieBtn = page.getByTestId('cookie-decline-button');


  await expect.soft(cookieBanner).toBeVisible();
  await expect.soft(cookieBanner).toContainText('Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с политикой конфиденциальности.');
  await expect.soft(acceptCookieBtn).toBeVisible()
  await expect.soft(declineCookieBtn).toBeVisible()
})

test('Проверка закрытия плашки cookie кнопкой "Принять"', async ({page}) => {
  await page.goto('');

  const cookieBanner = page.getByTestId('cookie-consent-banner');
  const acceptCookieBtn = page.getByTestId('cookie-accept-button');

  await expect.soft(cookieBanner).toBeVisible();
  await expect.soft(acceptCookieBtn).toHaveText('Принять');
  await acceptCookieBtn.click();
  await expect.soft(cookieBanner).toBeHidden();
})

test('Проверка закрытия плашки cookie кнопкой "Отклонить"', async ({page}) => {
  await page.goto('');

  const cookieBanner = page.getByTestId('cookie-consent-banner');
  const declineCookieBtn = page.getByTestId('cookie-decline-button');

  await expect.soft(cookieBanner).toBeVisible();
  await expect.soft(declineCookieBtn).toHaveText('Отклонить');
  await declineCookieBtn.click();
  await expect.soft(cookieBanner).toBeHidden();
})

test('Проверка ссылки и перехода по "Политике конфиденциальности" в плашке Cookie',  async({page}) => {
  await page.goto('');

  const cookieBanner = page.getByTestId('cookie-consent-banner');
  const privacy = page.getByTestId('cookie-consent-privacy-link');

  await expect.soft(cookieBanner).toBeVisible();
  await expect.soft(privacy).toHaveText('политикой конфиденциальности')
  await expect.soft(privacy).toHaveAttribute('href', '/privacy');
  await privacy.click();
  await expect.soft(page).toHaveTitle('Политика конфиденциальности | СладкийДом');
  await expect.soft(page).toHaveURL(`${baseURL}privacy`);
  await expect.soft(page.getByTestId('privacy-title')).toHaveText('Политика конфиденциальности');
})


