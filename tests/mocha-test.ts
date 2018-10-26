const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const proxy = require('selenium-webdriver/proxy');

// mocha
const assert = require('assert');
const test = require('selenium-webdriver/testing');

// Preferences
const pref = new webdriver.logging.Preferences();
pref.setLevel('browser', webdriver.logging.Level.SEVERE);
pref.setLevel('driver', webdriver.logging.Level.SEVERE);

// settings
const PAGE_LOAD_TIMEOUT_MS = 1000;
const SCRIPT_LOAD_TIMEOUT_MS = 10000;
const URL_HTTP = 'http://localhost:4200/';
const BROWSER = process.env.npm_config_browser;

// Driver for browser
let driver;

/* MOCHA TESTS */
test.describe('Selenium App test', function () {

  // before each test
  test.beforeEach(function (done) {

    // check flag and chose broser
    // npm run testmocha --browser=firefox  or
    // npm run testmocha --browser=chrome
    if (BROWSER === 'chrome') {
      this.timeout(10000);

      const chromeCapabilities = webdriver.Capabilities.chrome();
      const chromeOptions = new chrome.Options();
      chromeCapabilities.set('chromeOptions', chromeOptions);

      driver = new webdriver.Builder()
        .withCapabilities(chromeCapabilities)
        .setLoggingPrefs(pref)
        .setProxy(proxy.manual({
          http: 'localhost:4200'
        }))
        .build();

    } else {
      this.timeout(10000);

      const firefoxCapabilities = webdriver.Capabilities.firefox();
      const firefoxOptions = new firefox.Options();
      firefoxCapabilities.set('firefoxOptions', firefoxOptions);

      driver = new webdriver.Builder()
        .withCapabilities(firefoxCapabilities)
        .setLoggingPrefs(pref)
        .setProxy(proxy.manual({
          http: 'localhost:4200'
        }))
        .build();
    }

    driver.manage().timeouts().implicitlyWait(SCRIPT_LOAD_TIMEOUT_MS);
    driver.manage().window().maximize();

    driver.get(URL_HTTP)
      .then(() => {
        done();
      });

  });

  test.afterEach(function (done) {
    driver.quit()
      .then(() => {
        done();
      });
  });

  test.it('Web should have expected title value', function (done) {
    driver.getTitle()
      .then((title) => {
        assert.equal(title, 'SeleniumApp');
      })
      .then(() => {
        done();
      });
  });

  test.it('Check navigation change', function (done) {
    driver.navigate().to(URL_HTTP + 'contact')
      .then(() => {
        done();
      });
  });

  test.it('Check navigation change by navbar', function (done) {
    driver.findElement(webdriver.By.id('servers-link')).click()
      .then(() => {
        checkLogError(driver, done);
      });
  });

  test.it('Check load time for page', function (done) {
    driver.manage().timeouts().pageLoadTimeout(PAGE_LOAD_TIMEOUT_MS);

    driver.navigate().to(URL_HTTP + 'contact')
      .then(() => {
        driver.findElement(webdriver.By.id('servers-link'));
        driver.getTitle()
          .then((title) => {
            // On Success log it out
            console.log('Page: ', title);
            done();
          });
      });
  });

  test.it('should return -1 when the value is not present', function (done) {
    assert.equal([1, 2, 3].indexOf(4), -1);
    done();
  });

});


// Function used to check log for errors
function checkLogError(brwoserDriver, done) {

  if (process.env.npm_config_browser === 'chrome') {
      // get logs from chrome standard way of use
    brwoserDriver.manage().logs().get('browser')
      .then(function (entries) {
        entries.forEach(function (entry) {
          console.log('[%s] %s', entry.level.name, entry.message);
        });
        done();
      });
  } else {
    // get logs from firefox not standard way, becouse firefox webdriver has problem with tracking error
    // if something will change or someone find other way fix it
    // app.component.ts function for sending to window logs
    brwoserDriver.getWindowHandle().then(function (window) {
      // logEvent from window
      brwoserDriver.executeScript('return window.logEvents;').then(function (entries) {
        for (const entry of entries) {
          console.log(entry);
        }
      });
    });
    done();
  }
}
