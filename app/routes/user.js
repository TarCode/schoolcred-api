const mongoose = require('mongoose');
const Item = require('../models/item');

function signup(req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("passwords dont match");
		return next(err);
	}

	if (req.body.email &&
		req.body.username &&
		req.body.password &&
		req.body.passwordConf) {

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		User.create(userData, function (error, user) {
			if (error) {
				return next(error);
			} else {
				req.session.userId = user._id;
				return res.status(200).send("Signed up!");
			}
		});
	}
}

function signin(req, res, next) {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.status(200).send("Signed in!")
			}
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
}


function getProfile(req, res, next) {
	User.findById(req.session.userId)
		.exec(function (error, user) {
			if (error) {
				return next(error);
			} else {
				if (user === null) {
					var err = new Error('Not authorized! Go back!');
					err.status = 400;
					return next(err);
				} else {
					return res.json(user)
				}
			}
		});
}

function logout(req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.status(200).send("Logged Out!");
			}
		});
	}
}

function updateItem(req, res) {
	Item.findById({ _id: req.params.id }, (err, item) => {
		if (err) res.send(err);
		Object.assign(item, req.body).save((err, item) => {
			if (err) res.send(err);
			res.json({ message: "Item updated!", item });
		})
	})
}

module.exports = {
	getItems,
	getItem,
	postItem,
	deleteItem,
	updateItem
}