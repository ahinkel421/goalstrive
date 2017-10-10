const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Goal} = require('../models/goals');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedGoalData() {
	console.info('Seeding goal data...');
	const seedData = [];

	for (let i = 1; i <= 10; i++) {
		seedData.push(generateGoalData());
	}
	return Goal.insertMany(seedData);
}

function generateGoalData() {
	return {
		destination: faker.random.words(),
		eta: faker.date.past(),
		description: faker.random.words(),
		subGoals: [
			faker.random.words(),
			faker.random.words()
		]
		// useriD: 
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
		// return seedGoalData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	// describe('Get endpoint', function() {
	// 	it('should return all existing goals', function() {
	// 		let res;
	// 		return chai.request(app)
	// 		.get('/api/goals')
	// 		.then(function(_res) {
	// 			return Goal.count();
	// 		})
	// 		.then(function(count) {
	// 			res.body.goals.should.have.lengthOf(count);
	// 		})
	// 	});
	// });

	// describe('DELETE endpoint', function() {
	// 	it('should delete a goal by id', function() {
	// 		let goal;

	// 		return Goal
	// 		.findOne()
	// 		.then(function(_goal) {
	// 			goal = _goal;
	// 			return chai.request(app).delete(`/${goal.id}`);
	// 		})
	// 		.then(function(res) {
	// 			res.should.have.status(204);
	// 			return Goal.findById(goal.id);
	// 		})
	// 		.then(function(_goal) {
	// 			should.not.exist(_goal);
	// 		});
	// 	});
	// });
});




