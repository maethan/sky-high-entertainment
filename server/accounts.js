const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const config = require('./config.json')

// the mongodb server URL
const dbURL = config.mongo_url;

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )); // we return the entire connection, not just the DB
    // check that we are connected to the db
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};
/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

const signupAccount = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;
  const favoriteMovies = []
  const favoriteAirports = []

  const newUser = {
    username: username,
    password: password,
    favoriteMovies: favoriteMovies,
    favoriteAirports: favoriteAirports,
    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
  };

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    res.status(400).send('Username already exists');
  } else {
    const result = await db.collection('users').insertOne(newUser);
    req.session.username = username;
    req.session.save();
    res.status(201).send(result.insertedId);
  }
};

const loginAccount = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const password = req.query?.password ?? undefined;

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    //Check password
    if (exists.password === password) {
      req.session.username = username;
      req.session.save();
      res.status(201).send(exists);
    } else {
      res.status(400).send('Incorrect password');
    }
  } else {
    res.status(400).send('Username does not exist')
  }
};

const updateProfilePicture = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;
  const profilePicture = req.query?.profilePicture ?? undefined;

  const exists = await db.collection('users').updateOne({username: username}, {$set: {profilePicture: profilePicture}})
  if (exists) {
    res.status(201).send('Profile picture updated')
  } else {
    res.status(400).send('User does not exist')
  }
};


const getUserInfo = async (req, res) => {
  const db = await getDB();
  const username = req.query?.username ?? undefined;

  const exists = await db.collection('users').findOne({ username: username });
  if (exists) {
    res.status(200).send(exists)
  } else {
    res.status(400).send('User does not exist')
  }
};

const getCurrentUser = async (req, res) => {
  const username = req.session.username ?? "";
  res.send(username);
}

const logoutAccount = async (req, res) => {
  req.session.destroy();
  res.send('Logged out');
}

const getCurrentUserAirports = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";

  const result = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteAirports: 1});
  if (result) {
    res.status(200).send(result.favoriteAirports)
  } else {
    res.status(400).send('User does not exist')
  }
}

const getCurrentUserMovies = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";

  const result = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteMovies: 1});
  if (result) {
    res.status(200).send(result.favoriteMovies)
  } else {
    res.status(400).send('User does not exist')
  }
}

const addFavoriteAirport = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";
  const airportCode = req.query?.airportCode ?? undefined;
  const airportCountry = req.query?.airportCountry ?? undefined;
  const airportName = req.query?.airportName ?? undefined;

  const result = await db.collection('users').updateOne({ username: username }, {$push: {favoriteAirports: {airportCode: airportCode, airportCountry: airportCountry, airportName: airportName}}});
  if (result) {
    const newFavoriteAirports = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteAirports: 1});
    res.status(200).send(newFavoriteAirports)
  } else {
    res.status(400).send('User does not exist')
  }
}

const addFavoriteMovie = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";
  const name = req.query?.name ?? undefined;
  const poster = req.query?.poster ?? undefined;
  const runtime = req.query?.runtime ?? undefined;
  const budget = req.query?.budget ?? undefined;
  const imdbScore = req.query?.imdbScore ?? undefined;

  const result = await db.collection('users').updateOne({ username: username }, {$push: {favoriteMovies: {name: name, poster: poster, runtime: runtime, budget: budget, imdbScore: imdbScore}}});
  if (result) {
    const newFavoriteMovies = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteMovies: 1});
    res.status(200).send(newFavoriteMovies)
  } else {
    res.status(400).send('User does not exist')
  }
}

const removeFavoriteMovie = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";
  const name = req.query?.name ?? undefined;

  const result = await db.collection('users').updateOne({ username: username }, {$pull: {favoriteMovies: {name: name}}});
  if (result) {
    const newFavoriteMovies = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteMovies: 1});
    res.status(200).send(newFavoriteMovies)
  } else {
    res.status(400).send('User does not exist')
  }
}

const removeFavoriteAirport = async (req, res) => {
  const db = await getDB();
  const username = req.session.username ?? "";
  const airportCode = req.query?.airportCode ?? undefined;

  const result = await db.collection('users').updateOne({ username: username }, {$pull: {favoriteAirports: {airportCode: airportCode}}});
  if (result) {
    const newFavoriteAirports = await db.collection('users').findOne({ username: username }, {_id : 0, favoriteAirports: 1});
    res.status(200).send(newFavoriteAirports)
  } else {
    res.status(400).send('User does not exist')
  }
}

//get user info
//get current user

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  signupAccount,
  getCurrentUser,
  loginAccount,
  logoutAccount,
  getUserInfo,
  updateProfilePicture,
  getCurrentUserAirports,
  addFavoriteAirport,
  removeFavoriteAirport,
  getCurrentUserMovies,
  addFavoriteMovie,
  removeFavoriteMovie,
};