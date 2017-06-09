var router = require('express').Router();
var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectID;
var Vehicle = require('../models/vehicle');

// Get vehicles
router.get('/', function (req, res) {
	Vehicle.find({}).exec().then((vehicles) => {
		res.render('vehicles', { items: vehicles });
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/vehicles');
	});
});

router.get('/id/:id', function (req, res) {
	Vehicle.findOne({ _id: objectId(req.params.id) }).exec().then((vehicle) => {
		res.json(vehicle);
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/vehicles');
	});
});

// Create vehicle
router.get('/create', function (req, res) {
	res.render('addvehicle');
});

router.post('/create', function (req, res) {
	var newVehicle = new Vehicle({
		manufacturer: req.body.manufacturer,
		model: req.body.model,
		registrationPlate: req.body.registrationPlate,
		vin: req.body.vin,
		engineCapacity: req.body.engineCapacity,
		fuelType: req.body.fuelType,
		horsepower: req.body.horsepower,
		fuelConsumption: req.body.fuelConsumption,
		kilometrage: req.body.kilometrage
	});

	newVehicle.save(function (err, vehicle) {
		if (err) {
			req.flash('error_msg', 'Error adding vehicle.');
			res.redirect('/vehicles');
		} else {
			req.flash('success_msg', 'Vehicle created.');
			res.redirect('/vehicles');
		}
	});
});

// Update vehicle
router.post('/update/:id', function (req, res) {
	var _id = req.params.id,
		updatedVehicle = {
			manufacturer: req.body.manufacturer,
			model: req.body.model,
			registrationPlate: req.body.registrationPlate,
			vin: req.body.vin,
			engineCapacity: req.body.engineCapacity,
			fuelType: req.body.fuelType,
			horsepower: req.body.horsepower,
			fuelConsumption: req.body.fuelConsumption,
			kilometrage: req.body.kilometrage
		};
	Vehicle.findOneAndUpdate({ _id: objectId(_id) }, { $set: updatedVehicle }, { upsert: true }).exec().then((updatedVehicle) => {
		req.flash('success_msg', 'Vehicle updated.');
		res.redirect('/vehicles');
		// res.json(updatedVehicle);
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/vehicles');
	});
});

// Delete vehicle
router.get('/delete/:id', function (req, res) {
	Vehicle.findOneAndRemove({
		_id: objectId(req.params.id)
	}).exec().then((vehicle) => {
		req.flash('success_msg', 'Vehicle deleted.');
		res.redirect('/vehicles');
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/vehicles');
	});
});

// Get all trips 	TODO TODO TODO TODO TODO TODO
router.get('/trips', function (req, res) {
	Vehicle.find({}).exec().then((vehicles) => {
		console.log(vehicles);
		res.render('trips', { items: vehicles });
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/trips');
	});
});

// Get trip
router.get('/trips/id/:id', function (req, res) {
	Vehicle.findOne({ _id: objectId(req.params.id) }).exec().then((vehicle) => {
		res.render('trips', { items: vehicle });		
	}).catch((err) => {
		req.flash('error_msg', err);
		res.redirect('/trips');
	});
});

// function ensureAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		res.redirect('/users/login');
// 	}
// }

module.exports = router;