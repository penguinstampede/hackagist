require('dotenv').config();

// BASE SETUP
// =============================================================================

const express     = require('express');
const rp          = require('request-promise');
const hackagist   = express();

const hdapi       = process.env.HACKADAY_API_KEY;
const port        = process.env.PORT || 8080;

hackagist.set('view engine', 'ejs');

// ROUTES
// =============================================================================
const router = express.Router();

router.get('/', function(req, res) {

  let hackaday_projects = {
    uri: 'https://api.hackaday.io/v1/projects',
    qs: {
        api_key: hdapi
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(hackaday_projects)
    .then(function (response) {
      res.render('index', {project_query: response});
    })
    .catch(function (err) {
      console.log(err);
    });
});

hackagist.use('/', router);

// START THE SERVER
// =============================================================================
hackagist.listen(port);
console.log('Waiting for a visitor on port ' + port);

module.exports = hackagist;
