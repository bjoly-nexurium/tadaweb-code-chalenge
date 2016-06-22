var express = require('express');
var router = express.Router();
var CityModel = require('mongoose').model("cities")

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.json({message: 'Welcome to the code challenge API !'});
});

//Route to get all city with pagination
router.route('/cities/page?/:page?/perPage?/:perPage?/')
        // get all the cities
        .get(function (req, res) {
            //nb cities per page
            var perPage = 10;
            var currentPage = 0;
            //nb citites in the databases
            var totalCities;
            if (req.params.perPage != undefined)
                perPage = parseInt(req.params.perPage);
            if (req.params.page != undefined)
                currentPage = parseInt(req.params.page);

            //Get the count of the cities
            CityModel.count({}, function (err, count) {
                if (err)
                    res.send(err);
                totalCities = count;
            });

            //Find the next :perPage cities after perPage*currentPage
            CityModel.find({}, "_id name country dem population tz")
                    .skip(perPage * currentPage)
                    .limit(perPage)
                    .exec(function (err, cities) {
                        if (err)
                            res.send(err);
                        //We store the pagination meta in the result
                        res.json({totalCities: totalCities, cities: cities, currentPage: currentPage, perPage: perPage});
                    });
        });

//Route to add a new city 
router.route('/cities').post(function (req, res) {

    var city = new CityModel();      // create a new instance of the City model
    // TODO : set all the city infos
    //city.name = req.body.name;  

    // save the city and check for errors
    city.save(function (err) {
        if (err) {
            res.send(err);
            res.statusCode = 500;
        }

        res.json({message: 'City ' + city.name + ' created!'});
    });

});

router.route('/cities/:city_id')
        //Get the city by the ID
        .get(function (req, res) {
            CityModel.findById(req.params.city_id, function (err, city) {
                if (err) {
                    res.statusCode = 404;
                    res.send(err);
                }
                res.json(city);
            });
        })
        //update the city with this id
        .put(function (req, res) {

            // use our city model to find the city we want
            CityModel.findById(req.params.city_id, function (err, city) {

                if (err) {
                    res.send(err);
                    res.statusCode = 500;
                }

                // TODO : update the city infos
                //city.name = req.body.name; 

                // save the modification
                city.save(function (err) {
                    if (err) {
                        res.send(err);
                        res.statusCode = 500;
                    }

                    res.json({message: 'City ' + city.name + ' updated!'});
                });

            });
        })
        // delete the city with this id
        .delete(function (req, res) {
            CityModel.remove({
                _id: req.params.city_id
            }, function (err, city) {
                if (err) {
                    res.send(err);
                    res.statusCode=500;
                }

                res.json({message: 'City ' + city.name + ' Successfully deleted'});
            });
        })
        ;


router.route('/cities/autocomplete/:search')
        //Get the city by the ID
        .get(function (req, res) {
            //TODO Add multicriterias search
            CityModel.find({name: new RegExp(req.params.search, 'i')}, 'name _id country')
                    .exec(function (err, cities) {
                        if (err)
                            res.send(err);
                        res.json(cities);
                    });
        });

module.exports = router;
