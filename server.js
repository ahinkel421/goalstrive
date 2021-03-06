require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {DATABASE_URL, PORT} = require('./config');

const {usersRouter} = require('./routers/users-router'); // REGISTER USER
const {authRouter} = require('./routers/auth-router'); // Login + refresh
const {basicStrategy, jwtStrategy} = require('./auth/strategies');
const bodyParser = require('body-parser');

const app = express();
const {goalsRouter} = require('./routers/goalsRouter');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(passport.initialize());
passport.use('local', basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/goals', goalsRouter);

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
   return new Promise((resolve, reject) => {
     console.log('Closing server');
     server.close(err => {
       if (err) {
         return reject(err);
       }
       resolve();
     });
   });
 });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};

