import {test, expect, Page} from '@playwright/test';
import { fillAllFields } from '../helpers/fillAllFields.ts';
import { API_ENDPOINTS } from '../constants/api.ts';
import { ROUTES } from '../constants/routes.ts';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.ts';
import { mockRoute } from '../helpers/mockRoute.ts';
import { MOCK_FEEDBACK_SUCCESS_RESPONSE, MOCK_SERVER_ERROR_RESPONSE } from '../constants/mockApiResponses.ts';
import { createCaptchaResponsePromise, getTestingCaptchaCode } from '../helpers/captcha.ts';
import { getFeedbackLocator } from '../constants/locators.ts';

test('Отправка формы обратной связи с валидной капчей', async ({ page, request }) => {
  const captchaResponsePromise = createCaptchaResponsePromise(page);

  await page.goto(ROUTES.feedback);

  const code = await getTestingCaptchaCode(captchaResponsePromise, request);

  await fillAllFields(page, {code});
  const { submitButton, modalMessage } = getFeedbackLocator(page);

  await submitButton.click();

  await expect.soft(modalMessage).toBeVisible();
  await expect.soft(modalMessage).toContainText(RESPONSE_MESSAGES.feedbackModal.success);
});

test('Отправка формы обратной связи с неправильной, но валидной капчей)', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS.feedback, status: 200, body: MOCK_FEEDBACK_SUCCESS_RESPONSE});

  await page.goto(ROUTES.feedback);

  await fillAllFields(page);
  const { submitButton, modalMessage } = getFeedbackLocator(page);
  await submitButton.click();

  await expect.soft(modalMessage).toBeVisible();
  await expect.soft(modalMessage).toContainText(RESPONSE_MESSAGES.feedbackModal.success);
});

test('Проверка 500 ответа в форме обратной связи', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS.feedback, status: 500, body: MOCK_SERVER_ERROR_RESPONSE.server })

  await page.goto(ROUTES.feedback);

  await fillAllFields(page);
  const { submitButton, modalMessage } = getFeedbackLocator(page);
  await submitButton.click();

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
  const { submitButton, captchaError, modalMessage } = getFeedbackLocator(page);
  await submitButton.click({force: true});

  expect.soft(requestSent).toBe(false);
  await expect.soft(captchaError).toHaveText('Капча должна содержать 4 символа');
  await expect.soft(captchaError).toBeVisible();
  await expect.soft(modalMessage).not.toBeVisible();
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

test('Кнопка "Отправить" недоступна c пустым полем email', async ({ page }) => {
  mockRoute(page, {endpoint: API_ENDPOINTS.feedback, status: 200, body: MOCK_FEEDBACK_SUCCESS_RESPONSE});

  await page.goto(ROUTES.feedback);

  await fillAllFields(page, { email: ''});
  const { submitButton } = getFeedbackLocator(page);

  await expect.soft(submitButton).toBeDisabled();
});


test('Отображение ошибки при очистке поля email и исчезновение при заполнении поля валидным email', async ({ page }) => {
  await page.goto(ROUTES.feedback);

  await fillAllFields(page);
  const { submitButton, errorEmail, inputEmail } = getFeedbackLocator(page);

  await inputEmail.clear(); // очистили поле, воспользовалась https://playwright.help/docs/api/class-locator#locator-clear

  await expect.soft(submitButton).toBeDisabled();
  await expect.soft(errorEmail).toHaveText('Email обязателен для заполнения');

  await inputEmail.fill('as@asf.qw')

  await expect.soft(submitButton).not.toBeDisabled();
  await expect.soft(errorEmail).toBeHidden();
});

const invalidEmails = ['йц@asf.qw', 'asf@asf.дп', 'as@asf,qw', 'as@asf.q', 'as@asf.qwertyu', 'q', 'as@', '@asf.qw', 'asa@.qw', 'as@asf.', 'as@@asf.qw', 'a!s@asf.qw', 'as @asf.qw', 'as@a f.qw', 'as@af.q!w'];

invalidEmails.forEach((invalidEmail) => {
  test(`Отображение ошибки при вводе невалидного email ${invalidEmail} и исчезновение при исправлении email на валидный`,  async ({ page }) => {
    await page.goto(ROUTES.feedback);

    await fillAllFields(page, {email: invalidEmail});
    const { submitButton, errorEmail, inputEmail } = getFeedbackLocator(page);

    await expect.soft(submitButton).toBeDisabled();
    await expect.soft(errorEmail).toHaveText('Введите корректный email адрес');

    await inputEmail.fill('as@asf.qw')

    await expect.soft(submitButton).not.toBeDisabled();
    await expect.soft(errorEmail).toBeHidden();
  });
})

const validEmails = ['as@asf.qw', '14@asf.qw', 'as@asf.qwerty', 'a-s@asf.qw', 'a_s@asf.qw', 'a.s@asf.qw'];

validEmails.forEach((validEmails) => {
  test(`Проверка валидного email ${validEmails} на соответствие требованиям `,  async ({ page }) => {
    await page.goto(ROUTES.feedback);

    await fillAllFields(page, {email: validEmails});
    const { submitButton, errorEmail } = getFeedbackLocator(page);

    await expect.soft(submitButton).not.toBeDisabled();
    await expect.soft(errorEmail).toBeHidden();
  });
})
