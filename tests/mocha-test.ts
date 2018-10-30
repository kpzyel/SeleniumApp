const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const proxy = require('selenium-webdriver/proxy');

// Testing webdriver
const testSW = require('selenium-webdriver/testing');
const {
  By,
  Key,
  Until
} = require('selenium-webdriver');

// Mocha & Chai
const assert = require('assert');
const expectChai = require('chai').expect;
const should = require('chai').should();

// Preferences
const pref = new webdriver.logging.Preferences();
pref.setLevel('browser', webdriver.logging.Level.SEVERE);
pref.setLevel('driver', webdriver.logging.Level.SEVERE);

// settings
const PAGE_LOAD_TIMEOUT_MS = 1000;
const SCRIPT_LOAD_TIMEOUT_MS = 10000;
const URL_HTTP = 'http://localhost:9000/';
const BROWSER = process.env.npm_config_browser;

// Driver for browser
let driver;

/* MOCHA TESTS */
testSW.describe('Selenium App test', function () {

  // before each test
  testSW.beforeEach(function (done) {

    // check flag and chose broser
    if (BROWSER === 'chrome') {
      // npm run testmocha --browser=chrome
      this.timeout(14000);

      const chromeCapabilities = webdriver.Capabilities.chrome();
      const chromeOptions = new chrome.Options();
      chromeCapabilities.set('chromeOptions', chromeOptions);

      driver = new webdriver.Builder()
        .withCapabilities(chromeCapabilities)
        .setLoggingPrefs(pref)
        .setProxy(proxy.manual({
          http: 'localhost:9000'
        }))
        .build();

    } else {
      // npm run testmocha --browser=firefox  or
      this.timeout(14000);

      const firefoxCapabilities = webdriver.Capabilities.firefox();
      const firefoxOptions = new firefox.Options();
      firefoxCapabilities.set('firefoxOptions', firefoxOptions);

      driver = new webdriver.Builder()
        .withCapabilities(firefoxCapabilities)
        .setLoggingPrefs(pref)
        .build();
    }
    driver.manage().window().maximize();

    driver.get(URL_HTTP)
      .then(() => {
        done();
      });

  });

  testSW.afterEach(function (done) {
    driver.quit()
      .then(() => {
        // checkLogError(driver, done);
        done();
      });
  });

  testSW.it('Web should have expected title value', function (done) {
    driver.getTitle()
      .then((title) => {
        assert.equal(title, '');
      })
      .then(() => {
        done();
      });
  });

  testSW.it('Check navigation change', function (done) {
    driver.navigate().to(URL_HTTP + '#/customers')
      .then(() => {
        done();
      });
  });

  testSW.it('Check load time for page', function (done) {
    driver.manage().timeouts().pageLoadTimeout(PAGE_LOAD_TIMEOUT_MS);
    driver.manage().timeouts().implicitlyWait(SCRIPT_LOAD_TIMEOUT_MS);

    driver.navigate().to(URL_HTTP + '#/customers')
      .then(() => {
        driver.getTitle()
          .then((title) => {
            done();
          });
      });
  });

  testSW.it('Check navigation change by navbar', function (done) {
    driver.findElement(By.xpath('/html/body/div/div/nav/div/ul/li/a')).click()
      .then(() => {
        done();
      });
  });

  testSW.it('Check select', function (done) {
    this.timeout(200000);
    driver.navigate().to(URL_HTTP + '#/customers')
      .then(() => {
        // driver.sleep(4000);
        driver.wait(
            driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div[1]/div/div/input')), 2000)
          .then(element => {
            element.sendKeys('oib2');
            driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div/div/div/div/button')).click();
            driver.wait(
              driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div[2]/div/div/h4')),
              2000
            ).then((header) => {
              header.getText().then((text_body) => {
                console.log('text_body', text_body);
                expectChai(text_body).to.have.string('Dawid Vadin');
                done();
              });
            });
          });
      });
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
