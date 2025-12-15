const { test, expect } = require("@playwright/test");

test("niezalogowany użytkownik jest przekierowany do logowania", async ({ page }) => {
  await page.goto("http://localhost:3000/user/profile");

  await expect(page).toHaveURL(/\/user\/signin/);
  await expect(
    page.getByRole("heading", { name: /sign in/i })
  ).toBeVisible();
});
