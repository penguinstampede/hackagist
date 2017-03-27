require('dotenv').config();

// BASE SETUP
// =============================================================================

const express     = require('express');
const rp          = require('request-promise');
const hackagist   = express();

const hdapi       = process.env.HACKADAY_API_KEY;
const port        = process.env.PORT || 8080;

hackagist.set('view engine', 'ejs');
hackagist.use(express.static('public'));

// ROUTES
// =============================================================================
const router = express.Router();

router.get('/', function(req, res) {

  //trying to keep it dry
  var hackaday_api_call = {
    qs: {
        api_key: hdapi
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  },
  the_projects = {},
  the_owners = {};


  function get_projects(){
    hackaday_api_call.uri = 'https://api.hackaday.io/v1/projects';
    hackaday_api_call.qs.per_page = 10;
    rp(hackaday_api_call)
      .then(function (response) {
        the_projects = response;
        //an array of other Promise functions in case we need to get more info in the future
        Promise.all([get_owners(the_projects.projects)])
          .then(function(){
            res.render('index', {the_projects: the_projects, the_owners: the_owners});
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //we want info on the owners, each project only has an owner_id
  function get_owners(projects){
    return new Promise(function(resolve, reject) {
      var promises = [];
      for (p in projects) {
        hackaday_api_call.uri = 'https://api.hackaday.io/v1/users/' + projects[p].owner_id;
        promises.push(rp(hackaday_api_call));
      }

      Promise.all(promises)
        .then((results) => {
          the_owners = results;
          resolve(true);
        })
        .catch((e) => {
          reject(Error(e));
        });
    });
  }

  //now we really start. get the project list and move through it.
  get_projects();

});

hackagist.use('/', router);

// START THE SERVER
// =============================================================================
hackagist.listen(port);
console.log('Waiting for a visitor on port ' + port);

module.exports = hackagist;
