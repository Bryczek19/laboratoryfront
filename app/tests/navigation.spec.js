const { test, expect } = require("@playwright/test");

test("nawigacja do strony logowania", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // klik w link "Zaloguj" w sidebarze
  await page.getByText("Zaloguj").click();

  // sprawdzenie URL
  await expect(page).toHaveURL(/\/user\/signin/);

  // sprawdzenie nagłówka strony
  await expect(
    page.getByRole("heading", { name: /sign in/i })
  ).toBeVisible();
});
