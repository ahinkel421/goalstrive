const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Goal} = require('../models/goals');

router.get('/', (req, res) => {
	Goal
	.find()
	.exec()
	.then(goals => {
		res.json(goals.map(goal => goal.apiRepr()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Sorry, an unexpected error occurred. Please try again.'});
	});
});

router.get('/:id', (req, res) => {
	Goal
	.findById(req.params.id)
	.exec()
	.then(goal => res.json(goal.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Sorry, an unexpected error occurred. Please try again.'});
	});
});

router.post('/', (req, res) => {
	const requiredFields = ['title', 'dueDate', 'description'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Goal
	.create({
		title: req.body.title,
		dueDate: req.body.dueDate,
		description: req.body.description
	})
	.then(goal => res.status(201).json(goal.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something went wrong. Please try again.'});
	});

});


router.delete('/:id', (req, res) => {
	if(!req.body.id) {
		res.status(400).json({error: "Please enter an id in the request body and make sure it matches the request path id."})
	}
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	let deletedGoal = req.body.id;

	Goal
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(() => {
		res.json({"Success": `Goal with id '${deletedGoal}'' has been removed from your goals.`});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Sorry, the id entered is invalid. Please try again.'});
	});
});


router.put('/:id', (req, res) => {

	//edge cases
	if(!req.body.id) {
		res.status(400).json({error: "Please enter an id in the request body and make sure it matches the request path id."})
	}

	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['title', 'dueDate', 'description'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Goal
	.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
	.exec()
	.then(updatedGoal => res.status(201).json(updatedGoal.apiRepr()))
	.catch(err => res.status(500).json({error: 'Sorry, it looks like the id entered is not valid. Please try again.'}));
});

router.use('*', function(req, res) {
	res.status(404).json({message: 'Not Found'});
});

module.exports = {goalsRouter:router};
