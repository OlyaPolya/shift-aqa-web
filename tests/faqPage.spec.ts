import {test, expect} from '@playwright/test';

test('Страница FAQ с раскрытым ответом', async ({page}) => {
  await page.goto('faq');
  await page.getByTestId('cookie-accept-button').click();
  await page.getByTestId('faq-item-1').click();

  await expect.soft(page).toHaveScreenshot({
    fullPage: true
  });
});
