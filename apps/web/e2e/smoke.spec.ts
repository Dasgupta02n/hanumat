import { test, expect } from "@playwright/test";

test("landing shows three mandirs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("तीन धाम").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter Hanumat/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter Shivayatan/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter Kalika Dham/i }).first()).toBeVisible();
});

test("home hi loads brand", async ({ page }) => {
  await page.goto("/hi/");
  await expect(page.getByText("हनुमत").first()).toBeVisible();
});

test("shiva mandir loads lingashtakam", async ({ page }) => {
  await page.goto("/shiva/hi/path/lingashtakam/");
  await expect(page.getByText("लिङ्गाष्टकम्").first()).toBeVisible();
});

test("kali mandir loads adya", async ({ page }) => {
  await page.goto("/kali/hi/path/adya-stotram/");
  await expect(page.getByText("आद्या स्तोत्रम्").first()).toBeVisible();
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
