const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { buildDriver } = require("./driver");

const fs = require("fs");
const path = require("path");

describe("Herokuapp Login (Selenium + JS)", function () {
  this.timeout(30000);

  let driver;

  beforeEach(async () => {
  driver = await buildDriver();
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
    await driver.get("https://the-internet.herokuapp.com/login");

    await driver.findElement(By.id("username")).sendKeys("tomsmith");
    await driver.findElement(By.id("password")).sendKeys("SuperSecretPassword!");
    await driver.findElement(By.css("button[type='submit']")).click();

    const flash = await driver.wait(
      until.elementLocated(By.id("flash")),
      10000
    );

    const text = await flash.getText();
    expect(text).to.include("You logged into a secure area!");

  });

  it("shows an error message with invalid credentials", async () => {
    await driver.get("https://the-internet.herokuapp.com/login");

    await driver.findElement(By.id("username")).sendKeys("wronguser");
    await driver.findElement(By.id("password")).sendKeys("wrongpass");
    await driver.findElement(By.css("button[type='submit']")).click();

    const flash = await driver.wait(
      until.elementLocated(By.id("flash")),
      10000
    );

    const text = await flash.getText();
    expect(text).to.include("Your username is invalid!");
  });
});
