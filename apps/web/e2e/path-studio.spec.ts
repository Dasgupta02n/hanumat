import { test, expect } from "@playwright/test";

test("section route loads SK section page", async ({ page }) => {
  await page.goto("/en/path/sundar-kand/sk-s01/");
  await expect(page.getByText(/section route/i).first()).toBeVisible();
  await expect(page.getByText(/Sundar Kand/i).first()).toBeVisible();
});

test("low-data button present on chalisa path studio", async ({ page }) => {
  await page.goto("/en/path/hanuman-chalisa/");
  await expect(page.getByRole("button", { name: /low data/i })).toBeVisible({
    timeout: 15_000,
  });
});
