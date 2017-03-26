require('dotenv').config();
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//I'm connecting to SauceLabs with envionrment vars for Selenium
let assert = require('assert'),
  webdriver = require('selenium-webdriver'),
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

const chai = require('chai');
const server = require('../hackagist');
const chaiWebdriver = require('chai-webdriver');

chai.use(chaiWebdriver(driver));

let url = function(page){
  return "http://127.0.0.1:8080" + page;
}

after( (done) => {
  driver.quit()
    .then( () => { done(); });
});

describe('index page', () => {

  before( function (done) {
    this.timeout(0);
    driver.get(url('/'))
      .then( () => { done(); });
  });

  describe('load index', () => {
    it('should provide 50 projects', (done) => {
      chai.expect('li').dom.to.have.count(50);
      done();
    });
  });
});
