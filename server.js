require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {DATABASE_URL, PORT} = require('./config');

const {usersRouter} = require('./routers/users-router'); // REGISTER USER
const {authRouter} = require('./routers/auth-router'); // Login + refresh
const {basicStrategy, jwtStrategy} = require('./auth/strategies');

const app = express();
const {goalsRouter} = require('./routers/goalsRouter');

app.use(express.static('public'));
app.use(morgan('common'));

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
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/goals', goalsRouter);

// A protected endpoint which needs a valid JWT to access it
// app.get(
//   '/api/protected',
//   passport.authenticate('jwt', {session: false}),
//   (req, res) => {
//     return res.json({
//       data: 'rosebud'
//     });
//   }
//   );

// app.get(
//   '/api/unprotected',
//   (req, res) => {
//     return res.json({
//       data: 'rosebud'
//     });
//   }
//   );

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

mongoose.Promise = global.Promise;

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
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


//Defining my apps purpose:

  //This app allows users to take their larger, milestone goals and break
  //them down into smaller achievable goals. The idea is to make those
  //big lifetime goals seem less intimidating and more achievable by 
  //taking them one small step at a time. 



