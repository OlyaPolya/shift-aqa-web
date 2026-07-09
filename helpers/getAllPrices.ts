import { Locator } from '@playwright/test';
import { getNumberFromText } from './getNumberFromText.ts';

export async function getAllPrices(priceElements: Locator[]) {
  const prices: number[] = [];

  for (const element of priceElements) {
    const priceContent = await element.textContent() ?? '0';
    prices.push(getNumberFromText(priceContent));
  }

  return prices;
}
