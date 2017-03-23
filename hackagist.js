// BASE SETUP
// =============================================================================

const express     = require('express');
const hackagist   = express();
const ejs         = require('ejs');

const port        = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Good job! You are here!' });
});

hackagist.use('/', router);

// START THE SERVER
// =============================================================================
hackagist.listen(port);
console.log('Waiting for a visitor on port ' + port);

module.exports = hackagist;
