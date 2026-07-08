import { APIRequestContext, Page, Response  } from '@playwright/test';
import { API_ENDPOINTS } from '../constants/api.ts';

export function createCaptchaResponsePromise(page: Page) {
  return page.waitForResponse((response) =>
    response.url().includes(API_ENDPOINTS.captcha)
  );
}

export async function getTestingCaptchaCode(captchaPromise:  Promise<Response>, request: APIRequestContext) {
  const captchaResponse = await captchaPromise;
  const { id } = await captchaResponse.json();
  const response = await request.get(`${API_ENDPOINTS.testingCaptcha}?id=${id}`)
  const { code } = await response.json();

  return code;
}
