require('dotenv').config();
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//I'm connecting to SauceLabs with envionrment vars for Selenium
let webdriver = require('selenium-webdriver'),
  username    = process.env.SAUCE_USERNAME,
  accessKey   = process.env.SAUCE_ACCESS_KEY,
  driver;

driver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'chrome',
    'platform': 'Windows XP',
    'version': '43.0',
    'username': username,
    'accessKey': accessKey
  }).
  usingServer("http://" + username + ":" + accessKey +
              "@localhost:4445/wd/hub").
  build();

//Require the dev-dependencies
const chai = require('chai');
const server = require('../hackagist');
const chaiWebdriver = require('chai-webdriver');

chai.use(chaiWebdriver(driver));

describe('index page', () => {
  /*
  * Test the /GET route
  */
  describe('load index', () => {
    it('should reply with "Hello!"', (done) => {
      driver.get('/')
      chai.expect('p').dom.to.contain.text("Hello!");
      done();
    });
  });
});
