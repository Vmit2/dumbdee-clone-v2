import { test, expect } from '@playwright/test';

test('vendor portal loads bulk upload page', async ({ page }) => {
  await page.goto('http://localhost:3001/bulk-upload');
  await expect(page.locator('text=Bulk Upload')).toBeVisible();
});
