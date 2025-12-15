const { test, expect } = require("@playwright/test");

test("logowanie i wejście do profilu", async ({ page }) => {
  await page.goto("http://localhost:3000/user/signin");

  await page.getByLabel(/email/i).fill("test@test.pl");
  await page.getByLabel(/password/i).fill("haslo123");

  await page.getByRole("button", { name: /sign in/i }).click();

  await page.goto("http://localhost:3000/user/profile");
  await expect(page).toHaveURL(/\/user\/profile/);
});
