// BASE SETUP
// =============================================================================

const express     = require('express');
const hackagist   = express();

const port        = process.env.PORT || 8080;

hackagist.set('view engine', 'ejs');

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

hackagist.use('/', router);

// START THE SERVER
// =============================================================================
hackagist.listen(port);
console.log('Waiting for a visitor on port ' + port);

module.exports = hackagist;
