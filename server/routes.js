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

/** Query for searching movies where the parameters are all optional. These parameters include a movies name, min/max imdb score, 
 * language, min/max budget, countries of production, production companies, min/max runtime, and up to 3 genres. Additionally, 
 * pagination is done.
 */
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

/** Query to get a movie given its imdb id
 */
const get_movie = async function(req, res) {
  const imdbID = req.query.imdbID;
  console.log("imdbID: ", imdbID);
  connection.query(`
    SELECT *
    FROM Movies
    WHERE imdbID = '${imdbID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for movies: ', err);
      res.json({});
    } else {
      console.log('Movie data: ', data)
      res.send(data)
    }
  });
}

/** Query to get a flight given its flight id
 */
 const get_flight = async function(req, res) {
  const flightID = req.query.flightID;
  console.log("flightID: ", flightID);
  connection.query(`
    SELECT *
    FROM FlightPrices
    WHERE FlightID = '${flightID}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for flights: ', err);
      res.json({});
    } else {
      console.log('Flight data: ', data)
      res.send(data)
    }
  });
}

/** Given a Flight ID and number of segments, calculate the length of each segment (a segment is either a flight or a 
 * waiting time between flights) and then recommend 10 movies for each segment such that each recommended film can be
 * watched within the length of its corresponding segment. Furthermore, optional inputs for genre for each segment.
 */
const segment_recommendations = async function(req, res) {
  const flightID = req.query.flightID ?? '';
  const genre1 = req.query.genre1 ?? '';
  const genre2 = req.query.genre2 ?? '';
  const genre3 = req.query.genre3 ?? '';
  const genre4 = req.query.genre4 ?? '';
  const genre5 = req.query.genre5 ?? '';
  const genre6 = req.query.genre6 ?? '';
  const genre7 = req.query.genre7 ?? '';

  //promise to choose query based on segment length
  let promise = new Promise(function(resolve) {
    let segments = req.query.segments ?? 0;
    console.log('segments:', req.query.segments);
    if (segments == 0) {
      console.log('about to resolve 0');
      resolve(`
        SELECT M.name AS first
        FROM OneSegmentFlights F JOIN Movies M ON (F.DepartureTime - F.ArrivalTime) / 60 <= M.runtime
        WHERE FlightID = ${flightID} AND M.genres LIKE '%${genre1}%'
        ORDER BY popularity DESC
        LIMIT 10
      `);
    } else if (segments == 1) {
      console.log('about to resolve 1');
      resolve(`
        WITH SEG2 AS (
            SELECT *
            FROM TwoSegmentFlights
            WHERE FlightID = ${flightID}
        ), DUR AS (
            SELECT (firstArrivalTime - firstDepartureTime) / 60 AS DUR1, (secondDepartureTime - firstArrivalTime) / 60 AS DUR2, (secondArrivalTime - secondDepartureTime) / 60 AS DUR3
            FROM SEG2
        ), MOV1 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR1
        ), MOV2 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre2}%' AND runtime <= DUR.DUR2
        ), MOV3 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre3}%' AND runtime <= DUR.DUR3
        )
        SELECT M1.name AS first, M2.name AS second, M3.name AS third
        FROM MOV1 M1 JOIN MOV2 M2 ON M1.num = M2.num JOIN MOV3 M3 ON M1.num = M3.num
        LIMIT 10;
      `);
    } else if (segments == 2) {
      console.log('about to resolve 2');
      resolve(`
        WITH SEG3 AS (
            SELECT *
            FROM ThreeSegmentFlights
            WHERE FlightID = ${flightID}
        ), DUR AS (
            SELECT (firstArrivalTime - firstDepartureTime) / 60 AS DUR1,
                  (secondDepartureTime - firstArrivalTime) / 60 AS DUR2,
                  (secondArrivalTime - secondDepartureTime) / 60 AS DUR3,
                  (thirdDepartureTime - secondArrivalTime) / 60 AS DUR4,
                  (thirdArrivalTime - thirdDepartureTime) / 60 AS DUR5
            FROM SEG3
        ), MOV1 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR1
        ), MOV2 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR2
        ), MOV3 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR3
        ), MOV4 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR4
        ), MOV5 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR5
        )
        SELECT M1.name AS first, M2.name AS second, M3.name AS third, M4.name AS fourth, M5.name AS fifth
        FROM MOV1 M1
            JOIN MOV2 M2 ON M1.num = M2.num
            JOIN MOV3 M3 ON M1.num = M3.num
            JOIN MOV4 M4 ON M1.num = M4.num
            JOIN MOV5 M5 ON M1.num = M5.num
        LIMIT 10;
      `);
    } else {
      console.log('about to resolve 3');
      resolve(`
        WITH SEG4 AS (
            SELECT *
            FROM FourSegmentFlights
            WHERE FlightID = ${flightID}
        ), DUR AS (
            SELECT (firstArrivalTime - firstDepartureTime) / 60 AS DUR1,
                  (secondDepartureTime - firstArrivalTime) / 60 AS DUR2,
                  (secondArrivalTime - secondDepartureTime) / 60 AS DUR3,
                  (thirdDepartureTime - secondArrivalTime) / 60 AS DUR4,
                  (thirdArrivalTime - thirdDepartureTime) / 60 AS DUR5,
                  (fourthDepartureTime - thirdArrivalTime) / 60 AS DUR6,
                  (fourthArrivalTime - fourthDepartureTime) / 60 AS DUR7
            FROM SEG4
        ), MOV1 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre1}%' AND runtime <= DUR.DUR1
        ), MOV2 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre2}%' AND runtime <= DUR.DUR2
        ), MOV3 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre3}%' AND runtime <= DUR.DUR3
        ), MOV4 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre4}%' AND runtime <= DUR.DUR4
        ), MOV5 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre5}%' AND runtime <= DUR.DUR5
        ), MOV6 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre6}%' AND runtime <= DUR.DUR6
        ), MOV7 AS (
            SELECT name, ROW_NUMBER() OVER (ORDER BY popularity DESC) AS num
            FROM Movies, DUR
            WHERE genres LIKE '%${genre7}%' AND runtime <= DUR.DUR7
        )
        SELECT M1.name AS first,
              M2.name AS second,
              M3.name AS third,
              M4.name AS fourth,
              M5.name AS fifth,
              M6.name AS sixth,
              M7.name AS seventh
        FROM MOV1 M1
            JOIN MOV2 M2 ON M1.num = M2.num
            JOIN MOV3 M3 ON M1.num = M3.num
            JOIN MOV4 M4 ON M1.num = M4.num
            JOIN MOV5 M5 ON M1.num = M5.num
            JOIN MOV6 M6 ON M1.num = M6.num
            JOIN MOV7 M7 ON M1.num = M7.num
        LIMIT 10;
      `);
    }
  });

  promise.then(value => {
    console.log('query: ', value);
    connection.query(value, (err, data) => {
      if (err || data.length === 0) {
        console.log('error recommending movies for segments: ', err);
        res.json({});
      } else {
        console.log('Recommended segment movies: ', data)
        res.send(data)
      }
    });
  })
}

const airport_aggregations = (req, res) => {
  const airport = req.query.airport ?? "";

  connection.query(`
    SELECT f.StartingAirport,
      f.DestinationAirport,
      a.AirportID,
      a.Name,
      a.City,
      COUNT(*) as Count,
      AVG(BaseFare) as AvgBase,
      AVG(TotalFare) as AvgTotalFare,
      AVG(TravelDuration) as AvgDuration
    FROM FlightPrices f
    LEFT JOIN Airports a
    ON f.DestinationAirport = a.IATA
    WHERE f.StartingAirport = '${airport}'
    GROUP BY StartingAirport, DestinationAirport
    ORDER BY StartingAirport ASC, Count DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for airport: ', err);
      res.json({});
    } else {
      res.send(data)
    }
  });
}


/** Given source and destination airports, output all airlines that are available for this specific route
 */
 const get_route_airlines = async function(req, res) {
  const source = req.query.source;
  const destination = req.query.destination;

  if (!source || !destination) {
    console.log("need both source and destination airports");
    res.json({});
  }

  connection.query(`
    WITH AvailableRoutes AS (
        SELECT *
        FROM Routes
        WHERE Source = '${source}' AND Destination = '${destination}'
    )
    SELECT IATA, Country, Name, Callsign
    FROM AvailableRoutes AR JOIN Airlines AL ON AR.Airline = AL.IATA
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log('error searching for routes: ', err);
      res.json({});
    } else {
      console.log('Route data: ', data)
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
  get_movie,
  get_flight,
  segment_recommendations,
  airport_aggregations,
  get_route_airlines,
  airport_aggregations,
  get_route_airlines,
}
