const webdriver = require('selenium-webdriver');

// Browsers
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
    this.timeout(14000);

    getDriver();

    driver.get(URL_HTTP);
    driver.manage().window().maximize();
    driver.sleep(1000)
      .then(() => {
        done();
      });

  });

  testSW.afterEach(function (done) {
    checkLogError(driver, done);
  });

  testSW.it('Web should have expected title value', function (done) {
    driver.getTitle()
      .then((title) => {
        assert.equal(title, 'RBA.hr');
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

  testSW.it('Check login', function (done) {
    login(driver, done)
      .then(() => {
        done();
      });
  });

  testSW.it('Check navigation change by navbar', function (done) {
    login(driver, done)
      .then(() => {

        driver.wait(driver.findElement(By.xpath('/html/body/div/div/nav/div/ul/li/a')), 5 * 1000)
          .then(() => {

            driver.findElement(By.xpath('/html/body/div/div/nav/div/ul/li/a')).click()
              .then(() => {
                done();
              });
          });
      });
  });

  testSW.it('Check searchbar for OIB', function (done) {
    this.timeout(30000);

    login(driver, done)
      .then(() => {

        driver.navigate().to(URL_HTTP + '#/customers')
          .then(() => {
            driver.sleep(2000);

            driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div[1]/div/div/input')).sendKeys('oib2');
            driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div/div/div/div/button')).click();

            driver.sleep(1000);
            driver.findElement(By.xpath('//*[@id="customers-container-id-1"]/div/div[2]/div/h4'))
              .then((element) => {

                element.getText().then((text_body) => {
                  expectChai(text_body).to.have.string('Dawid Vadin');
                  done();
                });
              });
          });
      });
  });

});


// Function used to chose browser depends on script flag
function getDriver() {
  if (BROWSER === 'chrome' || BROWSER === 'Chrome') {
    // npm run testmocha --browser=chrome

    const chromeCapabilities = webdriver.Capabilities.chrome();
    const chromeOptions = new chrome.Options();
    chromeCapabilities.set('chromeOptions', chromeOptions);

    driver = new webdriver.Builder()
      .withCapabilities(chromeCapabilities)
      .setLoggingPrefs(pref)
      .build();

  } else if (BROWSER === 'firefox' || BROWSER === 'Firefox') {
    // npm run testmocha --browser=firefox

    const firefoxCapabilities = webdriver.Capabilities.firefox();
    const firefoxOptions = new firefox.Options();
    firefoxCapabilities.set('firefoxOptions', firefoxOptions);

    driver = new webdriver.Builder()
      .withCapabilities(firefoxCapabilities)
      .setLoggingPrefs(pref)
      .build();
  }
}

// Function used to login user
function login(wb, done) {
  return wb.wait(driver.findElement(By.xpath(('/html/body/form')), 5 * 1000)).then(el => {
    wb.findElement(By.xpath('//*[@id="inputEmail"]')).sendKeys('admin');
    wb.findElement(By.xpath('//*[@id="inputPassword"]')).sendKeys('admin');
    wb.findElement(By.xpath('//*[@id="sign-in"]')).click();
    driver.sleep(1000);
  });
}

// Function used to check log for errors
function checkLogError(brwoserDriver, done) {

  if (process.env.npm_config_browser === 'chrome') {
    // get logs from chrome standard way of use
    brwoserDriver.manage().logs().get('browser')
      .then(function (entries) {
        entries.forEach(function (entry) {
          console.log('[%s] %s', entry.level.name, entry.message);
        });

        driver.quit()
          .then(() => {
            done();
          });
      });
  } else {
    // get logs from firefox not standard way, becouse firefox webdriver has problem with tracking error
    // if something will change or someone find other way fix it
    // app.component.ts function for sending to window logs

    // brwoserDriver.getWindowHandle().then(function (window) {
    //   // logEvent from window
    //   brwoserDriver.executeScript('return window.logEvents;').then(function (entries) {
    //     for (const entry of entries) {
    //       console.log(entry);
    //     }
    //   });
    // });
    driver.quit()
      .then(() => {
        done();
      });
  }
}
