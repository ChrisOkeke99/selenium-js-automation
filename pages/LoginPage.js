const { By, until } = require("selenium-webdriver");

class LoginPage {
  constructor(driver) {
    this.driver = driver;

    // Selectors
    this.usernameInput = By.id("username");
    this.passwordInput = By.id("password");
    this.loginButton = By.css("button[type='submit']");
    this.flashMessage = By.id("flash");
  }

  async open() {
    await this.driver.get("https://the-internet.herokuapp.com/login");
  }

  async login(username, password) {
    await this.driver.findElement(this.usernameInput).sendKeys(username);
    await this.driver.findElement(this.passwordInput).sendKeys(password);
    await this.driver.findElement(this.loginButton).click();
  }

  async getFlashMessage() {
    const flash = await this.driver.wait(
      until.elementLocated(this.flashMessage),
      10000
    );
    return flash.getText();
  }
}

module.exports = LoginPage;
