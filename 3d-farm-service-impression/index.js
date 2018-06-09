const express = require('express');
const app = express();
const imprimer = require('./api/imprimer.js');

app.get('/', function (req, res) {
  res.send('Je suis le service d\'impression!');
});

app.get('/imprimer', imprimer);

app.listen(3000, function () {
  console.log('Le service d\'impression est en cours de servir la porte 3000!');
});