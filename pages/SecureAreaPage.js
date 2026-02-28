const { By, until } = require("selenium-webdriver");

class SecureAreaPage {
  constructor(driver) {
    this.driver = driver;

    this.logoutButton = By.css("a.button.secondary.radius");
    this.flashMessage = By.id("flash");
  }

  async logout() {
    const btn = await this.driver.wait(
      until.elementLocated(this.logoutButton),
      10000
    );
    await btn.click();
  }

  async getFlashMessage() {
    const flash = await this.driver.wait(
      until.elementLocated(this.flashMessage),
      10000
    );
    return flash.getText();
  }
}

module.exports = SecureAreaPage;
