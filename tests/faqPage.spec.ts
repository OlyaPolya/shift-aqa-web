import {test, expect} from '@playwright/test';

test('Страница FAQ с раскрытым ответом', async ({page}) => {
  await page.goto('faq');
  await page.getByTestId('cookie-accept-button').click();
  await page.getByTestId('faq-item-1').click();

  await expect.soft(page).toHaveScreenshot({
    fullPage: true,
  });
});

/* Появилась идея добавить текст оценкой фунциональной возможности раскрыть/закрыть ответ на вопрос.
Думаю, таким образом тест будет стабильнее, т.к. скриншотный тест может падать чаще из-за изменений текста на странице.
Но столкнулась с проблемой, что ответ физически существует в DOM всегда и скрывается изменением высоты. Поэтому тест, к сожалению, не рабочий.
По всей видимости, нужна проверка класса (например, max-h-0) или атрибута aria-expanded, или чего-то иного.

test('Проверка открытия и закрытия ответа на вопрос страницы "Часто задаваемые вопросы"', async ({page}) => {
  await page.goto('faq');
  await page.getByTestId('cookie-accept-button').click();

  const answer = page.getByTestId('faq-answer-1');

  await expect.soft(answer).toBeHidden();
  await page.getByTestId('faq-question-1').click();
  await expect.soft(answer).toBeVisible();
});
*/
