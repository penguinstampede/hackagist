require('dotenv').config();
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//I'm connecting to SauceLabs with envionrment vars for Selenium
const assert    = require('assert'),
  webdriver     = require('selenium-webdriver'),
  username      = process.env.SAUCE_USERNAME,
  accessKey     = process.env.SAUCE_ACCESS_KEY;
  chai          = require('chai');
  server        = require('../hackagist');
  chaiWebdriver = require('chai-webdriver');

let driver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'chrome',
    'platform': 'Windows 7',
    'version': '50.0',
    'username': username,
    'accessKey': accessKey
  }).
  usingServer("http://" + username + ":" + accessKey +
              "@localhost:4445/wd/hub").
  build();

//since we're testing locally
function url (page){
  return "http://127.0.0.1:8080" + page;
}

chai.use(chaiWebdriver(driver));

describe('index page', () => {

  //load the page first
  before( function (done) {
    driver.get(url('/'))
      .then( () => { done(); });
  });

  after( (done) => {
    driver.quit()
      .then( () => { done(); });
  });

  describe('Render a page that shows a list or grid of projects (using GET /projects).', () => {
    it('should provide 12 projects', (done) => {
      chai.expect('article.project').dom.to.have.count(12);
      done();
    });
    it('should have a hackaday CDN image for every project', (done) => {
      chai.expect('article.project img').dom.to.have.attribute('src', /[a-z\:\/]*cdn.hackaday.io\/[a-z0-9.\/]*/);
      done();
    });
    it('should have an owner name for every project', (done) => {
      chai.expect('article.project h2.owner:empty').dom.to.have.count(0);
      done();
    });
    it('should have an owner id stored in data-owner-id for every project', (done) => {
      chai.expect('article.project h2.owner').dom.to.have.attribute('data-owner-id');
      done();
    });
  });
});
