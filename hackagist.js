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

  var hackaday_projects = {
    uri: 'https://api.hackaday.io/v1/projects',
    qs: {
        api_key: hdapi
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  },
  the_projects = {};


  function get_owners(projects){
    var hackaday_owners = {
      qs: {
          api_key: hdapi
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    }, promises = [];
    for (p in projects) {
      hackaday_owners.uri = 'https://api.hackaday.io/v1/users/' + projects[p].owner_id;
      promises.push(rp(hackaday_owners));
    }

    Promise.all(promises)
      .then((results) => {
        res.render('index', {the_projects: the_projects, the_owners: results});
      })
      .catch((e) => {
          // Handle errors here
      });

  }

  //now we really start. get the project list and move through it.

  rp(hackaday_projects)
    .then(function (response) {
      the_projects = response;
      get_owners(the_projects.projects);
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
