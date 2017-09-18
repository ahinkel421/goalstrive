const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATABASE_URL, PORT} = require('./config');

const app = express();
const goalsRouter = require('./goalsRouter');

app.use(express.static('public'));
app.use(morgan('common'));
app.use('/goals', goalsRouter);
// app.use(bodyParser.json());

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

//User Stories: 

  //As a user, I should be able to sign up for Goalstrive
  //



