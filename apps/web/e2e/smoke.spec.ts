import { test, expect } from "@playwright/test";

test("home hi loads brand", async ({ page }) => {
  await page.goto("/hi/");
  await expect(page.getByText("Hanumat").first()).toBeVisible();
});

test("chalisa path studio renders verses", async ({ page }) => {
  await page.goto("/hi/path/hanuman-chalisa/");
  await expect(page.getByText("हनुमान चालीसा").first()).toBeVisible();
  await expect(page.locator("#verse-hc-01, [id^=verse-]").first()).toBeVisible({
    timeout: 15_000,
  });
});

test("sundar kand has sections", async ({ page }) => {
  await page.goto("/hi/path/sundar-kand/");
  await expect(page.getByText(/सुंदर|Sundar|wave 0/i).first()).toBeVisible();
});

test("provisional banner present on SK", async ({ page }) => {
  await page.goto("/en/path/sundar-kand/");
  await expect(page.getByText(/Provisional/i).first()).toBeVisible();
});
