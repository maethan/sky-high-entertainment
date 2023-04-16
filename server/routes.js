const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

const test = async function(req, res) {
  connection.query(`
    SELECT *
    FROM test
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.send(data)
    }
  });
}

const routes = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Routes
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.send(data)
    }
  });
}

/**Given a substring that a user types, search the Airports database for airports that contains the substring in
 * their name, city, or IATA code
 */
const airport_search = async function(req, res) {
  const search = req.query.search
  console.log('search for: ', search)
  connection.query(`
    SELECT Name, Country, City, IATA
    FROM Airports
    WHERE IATA LIKE ('%${search}%') OR City LIKE('%${search}%') OR Name LIKE('%${search}%')
    LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for airport: ', err);
      res.json({});
    } else {
      res.send(data)
    }
  });
}

/** Query for searching flights where the parameters are all optional. These parameters include if a flight is non-stop,
 * the starting airport, the destination airport, the minimum/maximum duration of the trip, the airline, and the minimum/
 * maximum price of the trip. Additionally, pagination is done.
 */
const flight_search = async function(req, res) {
  const nonstop = req.query.nonstop ?? 0;
  const startAirport = req.query.startAirport ?? '';
  const destAirport = req.query.destAirport ?? '';
  const maxDuration = req.query.maxDuration ?? 3540;
  const minDuraction = req.query.minDuraction ?? 0;
  const airline = req.query.airline ?? '';
  const minPrice = req.query.minPrice ?? 0;
  const maxPrice = req.query.maxPrice ?? 8261;

  const pageSize = req.query.pageSize ?? 10;
  const page = req.query.page ?? 1;

  connection.query(`
    SELECT *
    FROM FlightPrices
    WHERE isNonStop = ${nonstop} AND StartingAirport LIKE '%${startAirport}%' AND DestinationAirport LIKE '%${destAirport}%' AND TravelDuration >= ${minDuraction} AND TravelDuration <= ${maxDuration} AND AirlineName LIKE '%${airline}%' AND TotalFare >= ${minPrice} AND TotalFare <= ${maxPrice}
    LIMIT ${pageSize}
    OFFSET ${pageSize * (page - 1)}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for flight: ', err);
      res.json({});
    } else {
      console.log('Flight data: ', data)
      res.send(data)
    }
  });
}

const movie_search = async function(req, res) {
  const minImdbScore = req.query.minImdbScore ?? 0;
  const maxImdbScore = req.query.maxImdbScore ?? 10;
  const minBudget = req.query.minBudget ?? 0;
  const maxBudget = req.query.maxBudget ?? 380000000;
  const language = req.query.language ?? '';
  const name = req.query.name ?? '';
  const countries = req.query.countries ?? '';
  const companies = req.query.company ?? '';
  const minRuntime = req.query.minRuntime ?? 0;
  const maxRuntime = req.query.maxRuntime ?? 705;

  const genre1 = req.query.genre1 ?? '';
  const genre2 = req.query.genre2 ?? '';
  const genre3 = req.query.genre3 ?? '';

  const pageSize = 10;
  const page = req.query.page ?? 1;
  
  connection.query(`
    SELECT *
    FROM Movies
    WHERE imdbScore <= ${maxImdbScore} AND imdbScore >= ${minImdbScore} AND budget >= ${minBudget} AND budget <= ${maxBudget} AND language LIKE '%${language}%' AND name LIKE '%${name}%' AND countries LIKE '%${countries}%' AND runtime >= ${minRuntime} AND runtime <= ${maxRuntime} AND companies LIKE '%${companies}%' AND Genres LIKE '%${genre1}%' AND Genres LIKE '%${genre2}%' AND Genres LIKE '%${genre3}%'
    LIMIT ${pageSize}
    OFFSET ${pageSize * (page - 1)}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for movies: ', err);
      res.json({});
    } else {
      console.log('Flight data: ', data)
      res.send(data)
    }
  });
}

module.exports = {
  test,
  routes,
  airport_search,
  flight_search,
  movie_search,
}
