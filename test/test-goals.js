const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Goal} = require('../models/goals');
const {User} = require('../models/users');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

let test_token = "";
let userId=""
chai.use(chaiHttp);

function seedGoalData() {
	console.info('Seeding goal data...');
	const seedData = [];

	for (let i = 1; i <= 10; i++) {
		seedData.push(generateGoalData());
	}
	return Goal.insertMany(seedData);
}

function generateUserData() {
	return {
		username: faker.internet.userName(),
		password: faker.name.lastName()
	}
}

function generateGoalData() {
	return {
		destination: faker.random.words(),
		eta: faker.date.past(),
		description: faker.random.words(),
		subGoals: [
			faker.random.words(),
			faker.random.words()
		],
		userId: userId
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Goal API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);

	});
	beforeEach(function() {
			return chai.request(app)
			.post('/api/users')
			.send({username:"test", password:"test123"})
			.then(function(res) {
				test_token = res.body.authToken;
				userId = res.body.id;
			}).then(function(){
				return seedGoalData()
			});
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('Get endpoint', function() {
		it('should return all existing goals', function() {
			let res;
			return chai.request(app)
			.get('/api/goals')
			.set('Authorization', `Bearer ${test_token}`)
			.then(function(_res) {
				res=_res;
				return Goal.count();
			})
			.then(function(count) {
				res.body.should.have.lengthOf(count);
			})
		});
	});

	// describe('DELETE endpoint', function() {
	// 	it('should delete a goal by id', function() {
	// 		let goal;

	// 		return Goal
	// 		.findOne()
	// 		.then(function(_goal) {
	// 			goal = _goal;
	// 			console.log(goal._id)
	// 			return chai.request(app)
	// 			.delete(`/api/goals/${goal._id}`)
	// 			.set('Authorization', `Bearer ${test_token}`)
	// 		})
	// 		.then(function(res) {
	// 			res.should.have.status(204);
	// 			return Goal.findById(goal._id);
	// 		})
	// 		.then(function(_goal) {
	// 			should.not.exist(_goal);
	// 		});
	// 	});
	// });

	describe('POST endpoint', function() {

		it('should add a new user', function() {
			const newUser = generateUserData();
			return chai.request(app)
			.post('/api/users')
			.send(newUser)
			.then(function(res) {
				let user = res.body;
				user.username.should.equal(newUser.username);
			});
		});

		it('should return a token when logging in', function() {
			const newUser = generateUserData();
			return chai.request(app)
			.post('/api/users')
			.send(newUser)
			.then(function(res) {
				let token = res.body.authToken;
				return chai.request(app)
				.post('/api/auth/login')
				.send(newUser)
				.then(function(res) {
					res.body.authToken.should.be.a("string");
				});
			});
		});

	}); 


});
