const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
let config = require('config');

const User = require('../models/user');

function signup(req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		return res.status(403).json({ success: false, message: 'Authentication failed. Passwords must match.' });
	}

	if (req.body.email && req.body.email.length > 0 &&
		req.body.username && req.body.username.length > 0 &&
		req.body.password && req.body.password.length > 0 &&
		req.body.passwordConf && req.body.passwordConf.length > 0) {

		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		User.create(userData, function (error, user) {
			if (error) {
				throw error;
			} else {
				const payload = {
					userId: user._id
				};
				var token = jwt.sign(payload, config.secret, {
					expiresIn: 144000 // expires in 24 hours
				});

				// return the information including token as JSON
				return res.status(200).json({
					success: true,
					message: 'Enjoy your token!',
					token: token,
					userId: user._id
				});
			}
		});
	} else {
		return res.status(403).json({ success: false, message: 'Authentication failed. All fields ust be completed' });
	}
}

function signin(req, res, next) {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (err, user) {
			if (err) return res.status(403).json({ success: false, message: "User not found!" });

			if (user) {
				const payload = {
					userId: user._id
				};
				var token = jwt.sign(payload, config.secret, {
					expiresIn: 144000 // expires in 24 hours
				});

				// return the information including token as JSON
				return res.status(200).json({
					success: true,
					message: 'Enjoy your token!',
					token: token,
					userId: user._id
				});
			}
		});
	} else {
		return res.status(403).json({ success: false, message: 'Authentication failed. All fields must be completed.' });
	}
}


function getProfile(req, res, next) {
	User.findById(req.query.userId)
		.exec(function (error, user) {
			if (error) {
				return res.status(401).json({ success: false, message: 'Not found!' });;
			} else {
				if (user === null) {
					return res.status(401).json({ success: false, message: 'Not authorized!' });
				} else {
					const payload = {
						userId: user._id,
						email: user.email,
						username: user.username
					};

					return res.json(payload)
				}
			}
		});
}

module.exports = {
	signup,
	signin,
	getProfile
}