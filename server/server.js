const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/test', routes.test);
app.get('/routes', routes.routes);
app.get('/airport_search', routes.airport_search);
app.get('/flight_search', routes.flight_search);
app.get('/movie_search', routes.movie_search)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
