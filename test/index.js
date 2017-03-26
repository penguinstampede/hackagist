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
    'platform': 'Windows XP',
    'version': '43.0',
    'username': username,
    'accessKey': accessKey
  }).
  usingServer("http://" + username + ":" + accessKey +
              "@localhost:4445/wd/hub").
  build();

//since we're testing locally
let url = function(page){
  return "http://127.0.0.1:8080" + page;
}

chai.use(chaiWebdriver(driver));

after( (done) => {
  driver.quit()
    .then( () => { done(); });
});

describe('index page', () => {

  //load the page first
  before( function (done) {
    this.timeout(0);
    driver.get(url('/'))
      .then( () => { done(); });
  });

  describe('Render a page that shows a list or grid of projects (using GET /projects).', () => {
    it('should provide 50 projects', (done) => {
      chai.expect('article.project').dom.to.have.count(50);
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
    it('should not have an empty list of tags', (done) => {
      chai.expect('article.project .tags:empty').dom.to.have.count(0);
      done();
    });
  });
});