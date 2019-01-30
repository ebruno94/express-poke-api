// Require statement so we can use express, bodyParser, and logger
const express = require('express');
const bodyParser = require('express');
const logger = require('morgan');
const request = require('request');

const app = express();
const router = express.Router();

// SET PORTS
const API_PORT = process.env.API_PORT || 3001;

// // Config API to use Body Parser;
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(logger('dev'));

// Set route paths
router.get('/', (req, res) => {
  res.send({
    server: {
      name: 'Small Pokemon API Server',
      apiVersion: '0.2'
    },
    availableData: {
      pokemon: {
        name: 'First 150 Pokemon',
        description: 'Display the first 150 Pokemon'
      },
      favePokemon: {
        name: 'Favorite Pokemon (under construction)',
        description: 'Display top 5 Pokemon among the first 150'
      },
      pokeballs: {
        name: 'Pokeballs',
        description: 'Display all the PokeBalls introduced in the series'
      }
    }
  })
})


router.get('/pokemon', (req, res) => {
  request('https://pokeapi.co/api/v2/pokemon/?limit=150', (err, response, body) => {
    if (err || !body) {
      res.send('An error has occurred during the process. Please try again later');
    };
    let results = JSON.parse(body).results;
    let pokeArray =  [];
    results.forEach((poke) => {
      pokeArray.push({
        pokemon: poke.name,
        infoUrl: poke.url
      });
    });
    res.send({
      format: 'array of objects',
      dataSet: pokeArray
    })
  });
});

router.get('/favePokemon', (req, res) => {


  request(`https://pokeapi.co/api/v2/pokemon/?limit=150`, (err, response, body) => {
    if (err || !body) {
      res.send('An error has occurred during the process. Please try again later.');
    };
    // ["scyther", "jigglypuff", "zapdos", "mewtwo", "pikachu"]
    let favoritePoke = [123, 25, 145, 150, 39]
    let result = JSON.parse(body).results;
    let pokeArray = result.filter((pokemon) => pokemon.name === "scyther" ||
            pokemon.name === "jigglypuff" ||
            pokemon.name === "zapdos" ||
            pokemon.name === "mewtwo" ||
            pokemon.name === "pikachu")
            .map((poke) => ({
                  pokemon: poke.name,
                  infoUrl: `https://pokeapi.co/api/v2/pokemon/${poke.name}`
            }));
    res.send({
      format: 'array of objects',
      dataSet: pokeArray
    })
  });
});

router.get('/pokeballs', (req, res) => {
  request('https://pokeapi.co/api/v2/item/?limit=16', (err, response, body) => {
    if (err || !body) {
      res.send('An error has occurred during the process. Please try again later');
    };
    let results = JSON.parse(body).results;
    res.send({
      format: 'array',
      dataSet: results
    });
  })
})

app.use('/', router);


app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
