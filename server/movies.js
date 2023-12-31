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

const getMovies = async function(req, res) {
  const page = req.query?.page ?? undefined;
  const limit = req.query?.limit ?? undefined;

  if (page !== undefined && limit !== undefined) {
    connection.query(`
      SELECT *
      FROM Movies
      WHERE poster IS NOT NULL AND language = 'en' AND budget > 0
      ORDER BY imdbScore DESC
      LIMIT ${limit}
      OFFSET ${page * limit};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.send(data)
      }
    });
  } else {
    res.send({})
  }
}

module.exports = {
  getMovies,
}
