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

const getDomesticAirports = async function(req, res) {
  connection.query(`
  SELECT DISTINCT StartingAirport, Name, City
  FROM FlightPrices f
  JOIN Airports a
  ON f.StartingAirport = a.IATA;
`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.send(data)
    }
  });
}

const getInternationalAirports = async function(req, res) {
  const page = req.query?.page ?? undefined;
  const limit = req.query?.limit ?? undefined;

  connection.query(`
  SELECT Name, Country, City, IATA 
  FROM Airports
  LIMIT ${limit}
  OFFSET ${page * limit};
`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.send(data)
    }
  });
} 

const airlinePrices = async function(req, res) {
  const airline = req.query?.airline ?? "";
  const startingAirport = req.query?.startingAirport ?? "";

  connection.query(`
  SELECT AirlineName, TotalFare, TravelDistance FROM FlightPrices
  WHERE AirlineName = '${airline}' AND StartingAirport = '${startingAirport}'
  LIMIT 200;
  `, (err, data) => {
    if (err || data.length === 0) {
      res.json([]);
    } else {
      res.send(data)
    }
  });
} 

const getAirportInformation = async function(req, res) {
  const airport = req.query?.airport ?? undefined;

  connection.query(`
    SELECT * 
    FROM FlightPrices
    WHERE StartingAirport = '${airport}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.send(data)
    }
  });
}

const getIntlAirportInformation = async function(req, res) {
  const airport = req.query?.airport ?? undefined;

  connection.query(`
    SELECT DISTINCT * FROM Routes r
    JOIN Airports a
    ON a.IATA = r.Destination
    WHERE Source = '${airport}';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      console.log("HI")
      console.log(data)
      res.send(data)
    }
  });
}

module.exports = {
  getDomesticAirports,
  getInternationalAirports,
  getAirportInformation,
  airlinePrices,
  getIntlAirportInformation,
}
