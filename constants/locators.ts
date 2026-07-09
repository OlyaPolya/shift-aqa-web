import { Page } from '@playwright/test';

export function getFeedbackLocator(page: Page) {
  return {
    submitButton : page.getByTestId('feedback-submit-button'),
    modalMessage: page.getByTestId('modal-message'),
    captchaError: page.getByTestId('feedback-captcha-error'),
    errorEmail: page.getByTestId('feedback-error-email'),
    inputEmail: page.getByTestId('feedback-input-email'),
  }
}

export function getCatalogLocator(page: Page) {
  return {
    sortDefault: page.getByTestId('catalog-sort-select'),
    sortAsc: page.getByTestId('catalog-sort-option-asc'),
    sortDesc: page.getByTestId('catalog-sort-option-desc'),
    nextPageBtn: page.getByTestId('catalog-pagination-next'),
  }
}
