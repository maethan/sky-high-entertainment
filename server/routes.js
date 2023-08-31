const mysql = require("mysql");
const config = require("./config.json");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
	host: config.rds_host,
	user: config.rds_user,
	password: config.rds_password,
	port: config.rds_port,
	database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

// Simple query to make sure database connection is properly established
const test = async function (req, res) {
	connection.query(
		`
    SELECT *
    FROM test
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log(err);
				res.json({});
			} else {
				res.send(data);
			}
		}
	);
};

/** Simply queries routes and then returns the first 10
 */
const routes = async function (req, res) {
	connection.query(
		`
    SELECT *
    FROM Routes
    LIMIT 10
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log(err);
				res.json({});
			} else {
				res.send(data);
			}
		}
	);
};

/** Given a substring that a user types, search the Airports database for airports that contains the substring in
 * their name, city, or IATA code
 */
const airport_search = async function (req, res) {
  // The substring given in the query
	const search = req.query.search;
	console.log("search for: ", search);
	connection.query(
		`
    SELECT Name, Country, City, IATA
    FROM Airports
    WHERE IATA LIKE ('%${search}%') OR City LIKE('%${search}%') OR Name LIKE('%${search}%')
    LIMIT 10
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for airport: ", err);
				res.json({});
			} else {
        // Send back any matching airports
				res.send(data);
			}
		}
	);
};

/** Query for searching flights where the parameters are all optional. These parameters include if a flight is non-stop,
 * the starting airport, the destination airport, the minimum/maximum duration of the trip, the airline, and the minimum/
 * maximum price of the trip. Additionally, pagination is done.
 */
const flight_search = async function (req, res) {
  // All query parameters are optional, so replace them with default values if they are not in the query
	const nonstop = req.query.nonstop ?? 1;
	const startAirport = req.query.startAirport ?? "";
	const destAirport = req.query.destAirport ?? "";
	const maxDuration = req.query.maxDuration ?? 3540;
	const minDuration = req.query.minDuration ?? 0;
	const airline = req.query.airline ?? "";
	const minPrice = req.query.minPrice ?? 0;
	const maxPrice = req.query.maxPrice ?? 8261;

  // Set default pagination size to 10, and first page to 1
	const pageSize = req.query.pageSize ?? 10;
	const page = req.query.page ?? 1;

	connection.query(
		`
    SELECT *
    FROM FlightPrices
    WHERE isNonStop >= ${nonstop} AND StartingAirport LIKE '%${startAirport}%' AND DestinationAirport LIKE '%${destAirport}%' AND TravelDuration >= ${minDuration} AND TravelDuration <= ${maxDuration} AND AirlineName LIKE '%${airline}%' AND TotalFare >= ${minPrice} AND TotalFare <= ${maxPrice}
    LIMIT ${pageSize}
    OFFSET ${pageSize * (page - 1)}
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for flight: ", err);
				res.send({});
			} else {
				console.log("Flight data: ", data);
				res.send(data);
			}
		}
	);
};

/** Query for searching routes where the parameters are all optional
 */
const route_search = async function (req, res) {
  // Replace any missing query inputs with the empty string
	const startAirport = req.query.startAirport ?? "";
	const destAirport = req.query.destAirport ?? "";

	connection.query(
		`
  WITH temp AS(
    SELECT DISTINCT Airline, Source, Destination, Stops, Name AS SName, Country AS SCountry, City AS SCity
    FROM Routes JOIN Airports on Airports.IATA = Routes.Source
  )
  , temp2 AS (
      SELECT DISTINCT Airline, Source, Destination, Stops, SName, SCountry, SCity, Name AS DName, Country AS DCountry, City AS DCity
      FROM temp JOIN Airports on Airports.IATA = temp.Destination
  )
  SELECT DISTINCT *
  FROM (temp2 JOIN Airlines ON temp2.Airline = Airlines.IATA)
  WHERE Source LIKE '${startAirport}' AND Destination LIKE '${destAirport}'
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for route: ", err);
				res.json({});
			} else {
				console.log("Route data: ", data);
				res.send(data);
			}
		}
	);
};

/** Query for searching movies where the parameters are all optional. These parameters include a movies name, min/max imdb score,
 * language, min/max budget, countries of production, production companies, min/max runtime, and up to 3 genres. Additionally,
 * pagination is done.
 */
const movie_search = async function (req, res) {
  // If any parameters are not in the query, replace them with the default values
	const minImdbScore = Number(req.query.minImdbScore) ?? 0;
	const maxImdbScore = Number(req.query.maxImdbScore) ?? 10;
	const minBudget = Number(req.query.minBudget) ?? 0;
	const maxBudget = Number(req.query.maxBudget) ?? 380000000;
	const language = req.query.language ?? "";
	const name = req.query.name ?? "";
	const countries = req.query.countries ?? "";
	const companies = req.query.company ?? "";
	const minRuntime = Number(req.query.minRuntime) ?? 0;
	const maxRuntime = Number(req.query.maxRuntime) ?? 705;

  // User can filter on up to 3 genres
	const genre1 = req.query.genre1 ?? "";
	const genre2 = req.query.genre2 ?? "";
	const genre3 = req.query.genre3 ?? "";

  //Sert default page size to 15
	const pageSize = 15;
	const page = Number(req.query.page) ?? 1;

	connection.query(
		`
    SELECT *
    FROM Movies
    WHERE imdbScore <= ${maxImdbScore} 
      AND imdbScore >= ${minImdbScore} 
      AND budget >= ${minBudget} 
      AND budget <= ${maxBudget} 
      AND language LIKE '%${language}%'
      AND name LIKE '%${name}%' 
      AND countries LIKE '%${countries}%' 
      AND runtime >= ${minRuntime} 
      AND runtime <= ${maxRuntime} 
      AND companies LIKE '%${companies}%' 
      AND Genres LIKE '%${genre1}%' 
      AND Genres LIKE '%${genre2}%' 
      AND Genres LIKE '%${genre3}%'
      AND poster IS NOT NULL
    ORDER BY budget DESC
    LIMIT ${pageSize}
    OFFSET ${pageSize * (page - 1)}
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for movies: ", err);
				console.log("data: ", data);
				res.json([]);
			} else {
				console.log("Flight data: ", data);
				res.send(data);
			}
		}
	);
};

/** Query for searching movies where the parameters are all optional. These parameters include a movies name, min/max imdb score,
 * language, min/max budget, countries of production, production companies, min/max runtime, and up to 3 genres. Additionally,
 * pagination is done.
 */
const movie_search_2 = async function (req, res) {
  // If any parameters are not in the query, replace them with the default values
	const minImdbScore = Number(req.query.minImdbScore) ?? 0;
	const maxImdbScore = Number(req.query.maxImdbScore) ?? 10;
	const minBudget = Number(req.query.minBudget) ?? 0;
	const maxBudget = Number(req.query.maxBudget) ?? 380000000;
	const language = req.query.language ?? "";
	const name = req.query.name ?? "";
	const countries = req.query.countries ?? "";
	const companies = req.query.company ?? "";
	const minRuntime = Number(req.query.minRuntime) ?? 0;
	const maxRuntime = Number(req.query.maxRuntime) ?? 705;

  // Search up to 3 genres
	const genre1 = req.query.genre1 ?? "";
	const genre2 = req.query.genre2 ?? "";
	const genre3 = req.query.genre3 ?? "";

  // Set default page size
	const pageSize = 15;
	const page = Number(req.query.page) ?? 1;

	connection.query(
		`
    SELECT *
    FROM Movies
    WHERE countries LIKE '%${countries}%' 
    ORDER BY budget DESC
    LIMIT ${pageSize}
    OFFSET ${pageSize * (page - 1)}
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for movies: ", err);
				console.log("data: ", data);
				res.json([]);
			} else {
				console.log("Flight data: ", data);
				res.send(data);
			}
		}
	);
};

/** Query to get a movie given its imdb id
 */
const get_movie = async function (req, res) {
  // Retrieve the ID, notice that there is no default value since this param is mandatory
	const imdbID = req.query.imdbID;
	console.log("imdbID: ", imdbID);
	connection.query(
		`
    SELECT *
    FROM Movies
    WHERE imdbID = '${imdbID}'
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for movies: ", err);
				res.json({});
			} else {
				console.log("Movie data: ", data);
				res.send(data);
			}
		}
	);
};

/** Query to get a flight given its flight id
 */
const get_flight = async function (req, res) {
  // Retrieve the ID, notice that there is no default value since this param is mandatory
	const flightID = req.query.flightID;
	console.log("flightID: ", flightID);
	connection.query(
		`
    SELECT *
    FROM FlightPrices
    WHERE FlightID = '${flightID}'
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for flights: ", err);
				res.json({});
			} else {
				console.log("Flight data: ", data);
				res.send(data);
			}
		}
	);
};

/** Given a Flight ID and number of segments, calculate the length of each segment (a segment is either a flight or a
 * waiting time between flights) and then recommend 10 movies for each segment such that each recommended film can be
 * watched within the length of its corresponding segment. Furthermore, optional inputs for genre for each segment.
 */
const segment_recommendations = async function (req, res) {
  // Replace any missing values with empty string
	const flightID = req.query.flightID ?? "";
	const genre1 = req.query.genre1 ?? "";
	const genre2 = req.query.genre2 ?? "";
	const genre3 = req.query.genre3 ?? "";
	const genre4 = req.query.genre4 ?? "";
	const genre5 = req.query.genre5 ?? "";
	const genre6 = req.query.genre6 ?? "";
	const genre7 = req.query.genre7 ?? "";

	//promise to choose query based on segment length
	let promise = new Promise(function (resolve) {
    // If segments is not given, then simply assume that the number is 0
		let segments = req.query.segments ?? 0;
		console.log("segments:", req.query.segments);
    // Select query based on the number of segments. Note that the number of segments must be exact in order to query the right table
		if (segments == 0) { // 0 segments
			console.log("about to resolve 0");
			resolve(`
        SELECT M.name AS first
        FROM OneSegmentFlights F JOIN Movies M ON (F.DepartureTime - F.ArrivalTime) / 60 <= M.runtime
        WHERE FlightID = ${flightID} AND M.genres LIKE '%${genre1}%'
        ORDER BY popularity DESC
        LIMIT 10
      `);
		} else if (segments == 1) { // 1 segment
			console.log("about to resolve 1");
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
		} else if (segments == 2) { // 2 segments
			console.log("about to resolve 2");
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
        )
        SELECT M1.name AS first, M2.name AS second, M3.name AS third, M4.name AS fourth, M5.name AS fifth
        FROM MOV1 M1
            JOIN MOV2 M2 ON M1.num = M2.num
            JOIN MOV3 M3 ON M1.num = M3.num
            JOIN MOV4 M4 ON M1.num = M4.num
            JOIN MOV5 M5 ON M1.num = M5.num
        LIMIT 10;
      `);
		} else { // 3 segments
			console.log("about to resolve 3");
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

	promise.then((value) => {
		console.log("query: ", value);
		connection.query(value, (err, data) => {
			if (err || data.length === 0) {
				console.log("error recommending movies for segments: ", err);
				res.json({});
			} else {
				console.log("Recommended segment movies: ", data);
				res.send(data);
			}
		});
	});
};

/** Given an airport, get the average aggregation statistics for base fare, total fare, and duration by joining the airport
 * and flight prices tables. Then, sort all results by starting airport, and then by the number of flights out of the airport.
 */
const airport_aggregations = (req, res) => {
  // Retrieve airport from query
	const airport = req.query.airport ?? "";

  connection.query(`
    SELECT f.StartingAirport as StartingAirport,
      f.DestinationAirport as DestinationAirport,
      a.AirportID as DestinationID,
      a.Name as DestinationName,
      a.City as DestinationCity,
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
  `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for airport: ", err);
				res.json({});
			} else {
				res.send(data);
			}
		}
	);
};

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
      console.log('error searching for airport: ', err);
      res.json([]);
    } else {
      console.log('Route data: ', data)
      res.send(data)
    }
  });
}

// For the city of Philly, choose 5 random cheap flights.
const get_phl_flights = (req, res) => {
	connection.query(
		`
    WITH cheapest AS (
      SELECT DISTINCT fp.FlightID, fp.DestinationAirport AS DestinationAirport, fp.AirlineName AS AirlineName, fp.TotalFare AS LowestFare, fp.TravelDuration AS TravelDuration
      FROM FlightPrices fp
      WHERE StartingAirport LIKE '%phl%' AND isNonStop = 1 AND NOT EXISTS (
      SELECT 1 FROM FlightPrices
      WHERE StartingAirport LIKE '%phl%' AND isNonStop = 1 AND DestinationAirport = fp.DestinationAirport
      AND (TotalFare < fp.TotalFare OR (TotalFare = fp.TotalFare AND TravelDuration < fp.TravelDuration))
    ))
    SELECT FlightID, DestinationAirport, AirlineName, LowestFare, TravelDuration, a.City AS City
    FROM cheapest JOIN Airports a ON cheapest.DestinationAirport = a.IATA
    ORDER BY RAND()
    LIMIT 5;
    `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for airport: ", err);
				res.json({});
			} else {
				res.send(data);
			}
		}
	);
};

/**
 * For each of the 30 basic economy flights with a price closest to a certain value,
 * list the name of the most mediocre movie that can be watched during that flight
 * (the movie whose popularity is closest to the average popularity of all movies that can be watched during the flight).
 */
const mediocre_movies = (req, res) => {
	connection.query(
		`
    WITH flights AS (
      SELECT *
      FROM FlightPrices
      WHERE TotalFare < 100
      ORDER BY TotalFare DESC
      LIMIT 30
      )
      ,sameruntime AS (
      SELECT DISTINCT f.FlightID, f.StartingAirport, f.DestinationAirport, m.name, m.budget, m.popularity
      FROM flights f JOIN Movies m ON m.runtime <= f.TravelDuration
      )
      ,averages AS (
         SELECT s.FlightID, s.StartingAirport, s.DestinationAirport, s.name, s.budget, s.popularity, AVG( s.popularity) AS average
         FROM sameruntime s
         GROUP BY FlightID
      )
      , differences AS (
         SELECT sameruntime.FlightID ,sameruntime.name, sameruntime.budget, ABS(sameruntime.popularity - averages.average) AS difference
         FROM sameruntime JOIN averages ON averages.FlightID = sameruntime.FlightID
      )
      , minimums AS(
         SELECT FlightID, name, budget, difference, MIN(difference) AS smallest
         FROM differences
         GROUP BY FlightID
      )
      SELECT differences.FlightID AS flight, differences.name AS newname
      FROM differences JOIN minimums ON minimums.FlightID = differences.FlightID
      WHERE differences.difference = minimums.smallest
    `,
		(err, data) => {
			if (err || data.length === 0) {
				console.log("error searching for movies: ", err);
				res.json({});
			} else {
				res.send(data);
			}
		}
	);
};

module.exports = {
	test,
	routes,
	airport_search,
	movie_search_2,
	flight_search,
	movie_search,
	get_movie,
	get_flight,
	segment_recommendations,
	airport_aggregations,
  get_route_airlines,
	route_search,
	get_phl_flights,
	mediocre_movies,
};
