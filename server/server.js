const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const movies = require('./movies');
const airports = require('./airports');
const accounts = require('./accounts');
const session = require('express-session');

// Express is used to define API endpoints
const app = express(express.json());

app.use(
	cors({
		origin : "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'loginSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(express.json({
  type: ['application/json', 'text/plain'],
}));

// Each of our endpoints used to query our database
app.get("/test", routes.test);
app.get("/route_search", routes.route_search);
app.get("/routes", routes.routes);
app.get("/airport_search", routes.airport_search);
app.get("/flight_search", routes.flight_search);
app.get("/movie_search", routes.movie_search);
app.get("/movie_search_2", routes.movie_search_2);
app.get("/get_movie", routes.get_movie);
app.get("/get_flight", routes.get_flight);
app.get("/get_segment_recommendations", routes.segment_recommendations);
app.get("/airport_aggregations", routes.airport_aggregations);
app.get("/getMovies", movies.getMovies);
app.get("/get_phl_flights", routes.get_phl_flights);
app.get("/mediocre_movies", routes.mediocre_movies);
app.get('/get_domestic_airports', airports.getDomesticAirports);
app.get('/get_international_airports', airports.getInternationalAirports);
app.get('/get_airport', airports.getAirportInformation);
app.get('/get_airline', airports.airlinePrices);
app.get('/get_intl_airport', airports.getIntlAirportInformation);
app.post('/signup', accounts.signupAccount);
app.get('/get_current_user', accounts.getCurrentUser);
app.get('/get_user_info', accounts.getUserInfo);
app.post('/login', accounts.loginAccount);
app.post('/logout', accounts.logoutAccount);
app.post('/update_profile_picture', accounts.updateProfilePicture);
app.get('/get_current_user_airports', accounts.getCurrentUserAirports);
app.post('/add_favorite_airport', accounts.addFavoriteAirport);
app.post('/remove_favorite_airport', accounts.removeFavoriteAirport);
app.get('/get_current_user_movies', accounts.getCurrentUserMovies);
app.post('/add_favorite_movie', accounts.addFavoriteMovie);
app.post('/remove_favorite_movie', accounts.removeFavoriteMovie);

app.listen(config.server_port, () => {
	console.log(
		`Server running at http://${config.server_host}:${config.server_port}/`
	);
});

module.exports = app;
