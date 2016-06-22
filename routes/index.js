var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Welcome on the cities search engine'});
});

/* Route to render Partial View */
router.get('/partials/:folder?/:name', function (req, res, next) {
    var name = req.params.name;
    var folder = req.params.folder+'/';
    res.render('partials/'+folder+ name);
});

module.exports = router;
