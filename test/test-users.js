const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('../models/users');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedUserData() {
	console.info('Seeding user data...');
	const seedData = [];

	for (let i = 1; i <= 4; i++) {
		seedData.push(generateUserData());
	}
	return User.insertMany(seedData);
}

function generateUserData() {
	return {
		username: faker.internet.userName(),
		password: faker.name.lastName()
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('User API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedUserData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('POST endpoint', function() {
		it('should add a new user', function() {

			const newUser = generateUserData();

			return chai.request(app)
			.post('/api/users')
			.send(newUser)
			.then(function(res) {
				console.log(res.body);
				user.username.should.equal(newUser.username);
				// user.password.should.equal(newUser.password);
			});
		});
	});
});





