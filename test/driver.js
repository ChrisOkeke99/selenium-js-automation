const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--window-size=1280,800");

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

module.exports = { buildDriver };
