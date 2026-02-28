const SecureAreaPage = require("../pages/SecureAreaPage");
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { buildDriver } = require("./driver");

const fs = require("fs");
const path = require("path");
const LoginPage = require("../pages/LoginPage");

describe("Herokuapp Login (Selenium + JS)", function () {
  this.timeout(30000);

  let driver;
  let loginPage;
  let secureAreaPage;

  beforeEach(async () => {
  driver = await buildDriver();
  secureAreaPage = new SecureAreaPage(driver);
  loginPage = new LoginPage(driver);
  await loginPage.open();
});

  afterEach(async function () {
  // If the test failed, take a screenshot
  if (this.currentTest?.state === "failed" && driver) {
    const png = await driver.takeScreenshot();
    const fileName =
      this.currentTest.title.replace(/[^a-z0-9]+/gi, "_") +
      "_" +
      Date.now() +
      ".png";

    const filePath = path.join(
      __dirname,
      "..",
      "screenshots",
      fileName
    );

    fs.writeFileSync(filePath, png, "base64");
    console.log(`\n📸 Screenshot saved: ${filePath}`);
  }

  if (driver) await driver.quit();
});

  it("logs in successfully with valid credentials", async () => {
  await loginPage.login("tomsmith", "SuperSecretPassword!");
  const text = await loginPage.getFlashMessage();
  expect(text).to.include("You logged into a secure area!");
});


it("logs out successfully after logging in", async () => {
  await loginPage.login("tomsmith", "SuperSecretPassword!");

  await secureAreaPage.logout();

  // After logout you should be back on /login
  await driver.wait(until.urlContains("/login"), 10000);

  const text = await loginPage.getFlashMessage();
  expect(text).to.include("You logged out of the secure area!");
});



  it("shows an error message with invalid credentials", async () => {
  await loginPage.login("wronguser", "wrongpassword");
  const text = await loginPage.getFlashMessage();
  expect(text).to.include("Your username is invalid!");
});
});
