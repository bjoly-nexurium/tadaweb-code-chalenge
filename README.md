# Busbud Coding Challenge [![Build Status](https://circleci.com/gh/busbud/coding-challenge-backend-c/tree/master.png?circle-token=6e396821f666083bc7af117113bdf3a67523b2fd)](https://circleci.com/gh/busbud/coding-challenge-backend-c)

##Sources of the datas

https://github.com/busbud/coding-challenge-backend-c

##Starting the project
### Setting up the project

In the project directory run 

```
$ docker-compose rm
$ docker-compose build
$ docker-compose start
```

and access to the frontend at the address : http://DOCKERHOST:12040/

### Running the tests

The test suite can be run with

```
npm test
```

### Starting the application localy

To start a local server run. Think to start and populated your mongodb collection ( or run the db container ) 

```
MONGO_URL="localhost:27018/codechallenge" npm start
```

which should produce output similar to

```
Server running at http://127.0.0.1:3000/
```

