const mongoose = require('mongoose');
const User = require('../models/user');

function signup(req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		res.status(400).send("UNACCEPTABLE: Passwords dont match!");
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
				
				console.log("REQ SESSION ON SIGNUP", req.session);
				return res.status(200).send("Signed up!");
			}
		});
	} else {
		return res.status(400).send("UNACCEPTABLE: All fields must be complete!");
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
				req.session.cookie.userId = user._id;
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
		const db = mongoose.connection;
		console.log("REQ SESSION", req.session);
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.status(200).send("Logged Out!");
			}
		});
	}
}

module.exports = {
	signup,
	signin,
	getProfile,
	logout
}