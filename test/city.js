var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest')(app);

describe('GET /api/cities/autocomplete/', function () {
    describe('with a non-existent city', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/autocomplete/SomeRandomCityInTheMiddleOfNowhere')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('returns an empty array of cities', function () {
            expect(response.json).to.be.instanceof(Array);
            expect(response.json).to.have.length(0);
        });
    });
    describe('with a part of city name', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/autocomplete/Mont')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('returns an array of cities', function () {
            expect(response.json).to.be.instanceof(Array);
            expect(response.json).to.have.length.above(0);
        });

        it('contains a match', function () {
            expect(response.json).to.satisfy(function (cities) {
                return cities.some(function (city) {
                    return city.name == "Montréal"
                });
            });
        });
    });
    describe('with a valid city', function () {
        var response;
        before(function (done) {
            request
                    .get('/api/cities/autocomplete/Montpelier')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        //We test if the autocomplete return only one result when we have only one result in database
        it('returns one city', function () {
            expect(response.json).to.be.instanceof(Array);
            expect(response.json).to.have.lengthOf(1);
            expect(response.json).to.satisfy(function (cities) {
                return cities.every(function (city) {
                    return city.name == "Montpelier";
                });
            })
        });

    });
});

describe('GET /api/cities/:city_id', function () {
    describe('with a non-existent city', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/123456789')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 404', function () {
            expect(response.statusCode).to.equal(404);
        });

        it('returns an error message', function () {
            expect(response.json).to.have.property('message')
        });
    });

    describe('with an existent city', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/5767d8ec26bc4a3d73e0b527')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });


        it('is the good city', function () {
            expect(response.json.name).to.equal("Montréal");
            expect(response.json._id).to.equal("5767d8ec26bc4a3d73e0b527");
        });

        it('contains latitudes and longitudes', function () {
            expect(response.json).to.satisfy(function (city) {
                return city.lat && city.long
            })
        });
    });
});

describe('GET /api/cities/', function () {
    describe('with no perPage argument', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/page/10/perPage/')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('have the totalCities in response', function () {
            expect(response.json).to.have.property('totalCities');
        });

        it('have the current Page number in response', function () {
            expect(response.json).to.have.property('currentPage');
        });

        it('have the perPage value in response', function () {
            expect(response.json).to.have.property('perPage');
        });

        it('returns 10 cities', function () {
            expect(response.json.cities).to.be.instanceof(Array);
            expect(response.json.cities).to.have.lengthOf(10);
        });
    });

    describe('with no page and no perpage', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/page/perPage/')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('have the default current Page number in response', function () {
            expect(response.json).to.have.property('currentPage');
            expect(response.json.currentPage).to.equal(0);
        });

        it('have the default perPage value in response', function () {
            expect(response.json).to.have.property('perPage');
            expect(response.json.perPage).to.equal(10);
        });

        it('returns 10 cities', function () {
            expect(response.json.cities).to.be.instanceof(Array);
            expect(response.json.cities).to.have.lengthOf(10);
        });
    });

    describe('with no page but the perPage value is changed', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/page/perPage/25')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('have the default current Page number in response', function () {
            expect(response.json).to.have.property('currentPage');
            expect(response.json.currentPage).to.equal(0);
        });

        it('have the new perPage value in response', function () {
            expect(response.json).to.have.property('perPage');
            expect(response.json.perPage).to.equal(25);
        });

        it('returns 25 cities', function () {
            expect(response.json.cities).to.be.instanceof(Array);
            expect(response.json.cities).to.have.lengthOf(25);
        });
    });

    describe('with page number  and the perPage value', function () {
        var response;

        before(function (done) {
            request
                    .get('/api/cities/page/23/perPage/50')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('have the default current Page number in response', function () {
            expect(response.json).to.have.property('currentPage');
            expect(response.json.currentPage).to.equal(23);
        });

        it('have the new perPage value in response', function () {
            expect(response.json).to.have.property('perPage');
            expect(response.json.perPage).to.equal(50);
        });

        it('returns 50 cities', function () {
            expect(response.json.cities).to.be.instanceof(Array);
            expect(response.json.cities).to.have.lengthOf(50);
        });
    });
});
/*
describe(' Add, Update and  Delete a city', function () {
    var response;
    var newCity;

    before(function (done) {
        request
                .post('/api/cities/')
                .end(function (err, res) {
                    response = res;
                    response.json = JSON.parse(res.text);
                    request.get('/api/cities/' + response.json._id)
                            .end(function (err, res) {
                                newCity = res;
                                newCity.json = JSON.parse(res.text);
                            });
                    done(err);
                });
    });

    it('returns a 200', function () {
        expect(response.statusCode).to.equal(200);
    });

    it('the new city have be succesfully added', function () {
        expect(newCity.statusCode).to.equal(200);
        expect(newCity.json.name).to.equal("Nexuria");
    });
    it('all the datas have been added', function () {});

    describe('we can retreive the new city in the autocompletion', function () {
        var response;
        before(function (done) {
            request
                    .get('/api/cities/autocomplete/Nexuria')
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        //We test if the autocomplete return only one result when we have only one result in database
        it('returns one city', function () {
            expect(response.json).to.be.instanceof(Array);
            expect(response.json).to.have.lengthOf(1);
            expect(response.json).to.satisfy(function (cities) {
                return cities.every(function (city) {
                    return city.name == "Nexuria";
                });
            });
        });
    });

    describe('PUT /api/cities/:city_id - Update a city', function () {
        var response;
        var updatedCity;
        before(function (done) {
            request
                    .put('/api/cities/'+newCity.json._id)
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        request.get('/api/cities/' + response.json._id)
                                .end(function (err, res) {
                                    updatedCity = res;
                                    updatedCity.json = JSON.parse(res.text)
                                });
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('the new city have be succesfully updated', function () {});
    });
    
    describe('DELETE /api/cities/:city_id - Delete a city', function () {
        var response;
        var deletedCity;

        before(function (done) {
            request
                    .delete('/api/cities/'+newCity.json._id)
                    .end(function (err, res) {
                        response = res;
                        response.json = JSON.parse(res.text);
                        request.get('/api/cities/' + response.json._id)
                                .end(function (err, res) {
                                    deletedCity = res;
                                    deletedCity.json = JSON.parse(res.text)
                                });
                        done(err);
                    });
        });

        it('returns a 200', function () {
            expect(response.statusCode).to.equal(200);
        });

        it('the new city have be succesfully deleted', function () {
            expect(deletedCity.statusCode).to.equal(404);
        });

        describe('we can\'t retreive the new city in the autocompletion', function () {
            var response;
            before(function (done) {
                request
                        .get('/api/cities/autocomplete/Nexuria')
                        .end(function (err, res) {
                            response = res;
                            response.json = JSON.parse(res.text);
                            done(err);
                        });
            });

            it('returns a 200', function () {
                expect(response.statusCode).to.equal(200);
            });

            //We test if the autocomplete return only one result when we have only one result in database
            it('returns no city', function () {
                expect(response.json).to.be.instanceof(Array);
                expect(response.json).to.have.length(0);
            });
        });
    });
    
});
*/