// Require statement so we can use express, bodyParser, and logger
const express = require('express');
const bodyParser = require('express');
const logger = require('morgan');
const request = require('request');

const app = express();
const router = express.Router();

// SET PORTS
const API_PORT = process.env.API_PORT || 3032;

// // Config API to use Body Parser;
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(logger('dev'));

// Set route paths & initialize API
router.get('/', (req, res) => {
  request('https://pokeapi.co/api/v2/pokemon', (err, response, body) => {
    if (err || !body) {
      res.send('An error has occurred during the process. Please try again');
    };
    let results = JSON.parse(body).results;
    let pokeArray =  [];
    results.forEach((poke) => {
      pokeArray.push({
        pokemon: poke.name,
        url: poke.url
      });
    });
    res.send({
      server: {
        intro: "Here are the first 20 pokemon!",
        results: pokeArray
      }
    })
  });
});

app.use('/pokemon', router);


app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));