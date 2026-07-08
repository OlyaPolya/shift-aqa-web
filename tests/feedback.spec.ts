import {test, expect, Page} from '@playwright/test';
import { fillAllFields } from '../helpers/fillAllFields.ts';
import { API_ENDPOINTS } from '../constants/api.ts';
import { ROUTES } from '../constants/routes.ts';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.ts';
import { mockRoute } from '../helpers/mockRoute.ts';
import { MOCK_FEEDBACK_SUCCESS_RESPONSE, MOCK_SERVER_ERROR_RESPONSE } from '../constants/mockApiResponses.ts';
import { createCaptchaResponsePromise, getTestingCaptchaCode } from '../helpers/captcha.ts';

test('Отправка формы обратной связи с валидной капчей', async ({ page, request }) => {
  const captchaResponsePromise = createCaptchaResponsePromise(page);

  await page.goto(ROUTES.feedback);

  const code = await getTestingCaptchaCode(captchaResponsePromise, request);

  await fillAllFields(page, {code});
  await page.getByTestId('feedback-submit-button').click();

  const modalMessage = page.getByTestId('modal-message');
  await expect.soft(modalMessage).toBeVisible();
  await expect.soft(modalMessage).toContainText(RESPONSE_MESSAGES.feedbackModal.success);
});

test('Отправка формы обратной связи с неправильной, но валидной капчей)', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS.feedback, status: 200, body: MOCK_FEEDBACK_SUCCESS_RESPONSE});

  await page.goto(ROUTES.feedback);
  await fillAllFields(page);
  await page.getByTestId('feedback-submit-button').click();

  const modalMessage = page.getByTestId('modal-message');

  await expect.soft(modalMessage).toBeVisible();
  await expect.soft(modalMessage).toContainText(RESPONSE_MESSAGES.feedbackModal.success);
});

test('Проверка 500 ответа в форме обратной связи', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS.feedback, status: 500, body: MOCK_SERVER_ERROR_RESPONSE.server })

  await page.goto(ROUTES.feedback);

  await fillAllFields(page);
  await page.getByTestId('feedback-submit-button').click();

  const modalMessage = page.getByTestId('modal-message');

  await expect.soft(modalMessage).toBeVisible();
  await expect.soft(modalMessage).toContainText(RESPONSE_MESSAGES.feedbackModal.serverError);
});

test('Негативная проверка капчи - <min длины', async ({ page }) => {
  let requestSent = false;

  page.on('request', (request) => {
    if (request.url().includes(API_ENDPOINTS.feedback)) {
      requestSent = true;
    }
  })

  await page.goto(ROUTES.feedback);

  await fillAllFields(page, {code: 'qwe'});
  await page.getByTestId('feedback-submit-button').click({force: true});

  const captchaErrorSelector = page.getByTestId('feedback-captcha-error')

  expect.soft(requestSent).toBe(false);
  await expect.soft(captchaErrorSelector).toHaveText('Капча должна содержать 4 символа');
  await expect.soft(captchaErrorSelector).toBeVisible();
  await expect.soft(page.getByTestId('modal-message')).not.toBeVisible();
});

/*
Покройте тестами поле email (позитивные и негативные проверки)

Требования к полям в домашке №3
email - обязательное, латиница, цифры, "." "-" "_", обязательно должно иметь @ между доменной и локальной частью, . между доменной частью и доменной зоной которая может минимум 2 символа максимум 6
Валидация фронта должна осуществлять при  вводе символов, должна отображаться ошибка с подсказкой
Кнопка отправить задизейблена пока не заполнены корректно все обязательные поля
После устраненния ошибки - ошибка пропадает кнопка кликабельна

Ошибки:
Email обязателен для заполнения
Введите корректный email адрес
*/

test('Кнопка "Отправить" недоступна c пустым полем email', async ({ page, request }) => {
  const captchaResponsePromise = createCaptchaResponsePromise(page);

  await page.goto(ROUTES.feedback);

  const code = await getTestingCaptchaCode(captchaResponsePromise, request);
  await fillAllFields(page, {code, email: ''});

  await expect.soft(page.getByTestId('feedback-submit-button')).toBeDisabled();
});


test('Отображение ошибки при очистке поля email и исчезновение при заполнении поля валидным email', async ({ page, request }) => {
  const captchaResponsePromise = createCaptchaResponsePromise(page);

  await page.goto(ROUTES.feedback);

  const code = await getTestingCaptchaCode(captchaResponsePromise, request);
  await fillAllFields(page, {code});

  await page.getByTestId('feedback-input-email').clear(); // очистили поле, воспользовалась https://playwright.help/docs/api/class-locator#locator-clear

  const submitButton = page.getByTestId('feedback-submit-button');
  const errorEmail = page.getByTestId('feedback-error-email');

  await expect.soft(submitButton).toBeDisabled();
  await expect.soft(errorEmail).toHaveText('Email обязателен для заполнения');

  await page.getByTestId('feedback-input-email').fill('as@asf.qw')

  await expect.soft(submitButton).not.toBeDisabled();
  await expect.soft(errorEmail).toBeHidden();
});

const invalidEmails = ['йц@йцу.йц', 'asasf.qw', 'as@asfqw', 'as@asf.q', 'as@asf.qwertyu', 'q'];

invalidEmails.forEach((invalidEmail) => {
  test(`Отображение ошибки при вводе невалидного email ${invalidEmail} и исчезновение при исправлении email на валидный`,  async ({ page, request }) => {
    const captchaResponsePromise = createCaptchaResponsePromise(page);

    await page.goto(ROUTES.feedback);

    const code = await getTestingCaptchaCode(captchaResponsePromise, request);
    await fillAllFields(page, {code, email: invalidEmail});

    const submitButton = page.getByTestId('feedback-submit-button');
    const errorEmail = page.getByTestId('feedback-error-email');

    await expect.soft(submitButton).toBeDisabled();
    await expect.soft(errorEmail).toHaveText('Введите корректный email адрес');

    await page.getByTestId('feedback-input-email').fill('as@asf.qw')

    await expect.soft(submitButton).not.toBeDisabled();
    await expect.soft(errorEmail).toBeHidden();
  });
})

const validEmails = ['as@asf.qw', '14@asf.qw', 'as@asf.qwerty', 'a-s@asf.qw', 'a_s@asf.qw', 'a.s@asf.qw'];

validEmails.forEach((validEmails) => {
  test(`Проверка валидного email ${validEmails} на соответствие требованиям `,  async ({ page, request }) => {
    const captchaResponsePromise = createCaptchaResponsePromise(page);

    await page.goto(ROUTES.feedback);

    const code = await getTestingCaptchaCode(captchaResponsePromise, request);
    await fillAllFields(page, {code, email: validEmails});

    await expect.soft(page.getByTestId('feedback-submit-button')).not.toBeDisabled();
    await expect.soft(page.getByTestId('feedback-error-email')).toBeHidden();
  });
})


