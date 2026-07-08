import { Page } from '@playwright/test'

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

type Products = Product[];

interface RouteBody {
  pagination?: Pagination;
  products?: Products;
  error?: string;
  success?: boolean;
  message?: string;
}

interface RouteOptions {
  endpoint: string;
  status: number;
  body: RouteBody;
}

// типы лучше выносить, но пока так

export async function mockRoute(page: Page, {endpoint, status, body}: RouteOptions) {
  await page.route(endpoint, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body)
    })
  })
}
