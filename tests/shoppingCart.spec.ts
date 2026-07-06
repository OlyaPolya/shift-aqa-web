import {test, expect} from '@playwright/test';

test('Корзина с товаром', async ({page}) => {
  await page.goto('catalog');

  const addCartBtn = page.getByTestId('catalog-add-to-cart-button-prod-001');

  await addCartBtn.click();
  await addCartBtn.click();
  await page.getByTestId('header-cart-button').click();
  await page.getByTestId('cookie-accept-button').click();

  const cardContent = page.getByTestId('cart-item-prod-001');
  const productImage = cardContent.getByRole('img');
  const productInfo = cardContent.locator('div', { hasText: '₽/кг' }) // решила объединить информацию и продукте в корзине в единый блок для маскирования, т.к. может измениться название, цена и категория, кроме текста '₽/кг'. Воспользовалась документацией playwright, т.к. не знала как на div, содержащий текст '₽/кг', выйти. Я подумала, что '₽/кг' - это наиболее стабильный параметр в нашем случае, нежели, классы и теги

  await expect.soft(page).toHaveScreenshot({
    fullPage: true,
    mask: [
      page.getByTestId('cart-total-price'),
      page.getByTestId('cart-captcha-image'),
      page.locator('[data-testid^="catalog-product-price-prod-"]'),
      productImage,
      productInfo
    ]
  });
})




