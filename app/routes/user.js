const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
let config = require('config');

const User = require('../models/user');

function signup(req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		return res.status(403).json({ success: false, message: 'Signup failed. Passwords must match.' });
	}

	const user = req.body

	if (user.email && user.email.length > 0 &&
		user.username && user.username.length > 0 &&
		user.password && user.password.length > 0 &&
		user.passwordConf && user.passwordConf.length > 0) {

		var userData = {
			email: user.email,
			username: user.username,
			password: user.password,
			passwordConf: user.passwordConf,
		}

		User.create(userData, function (error, user) {
			if (error) {
				res.status(403).json({ success: false, message: 'Signup failed. User already exists.' });
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
		return res.status(403).json({ success: false, message: 'Signup failed. All fields must be completed' });
	}
}

function signin(req, res, next) {

	const user = req.body

	if (user.email && user.password) {
		User.authenticate(user.email, user.password, function (err, user) {
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
					return res.status(401).json({ success: false, message: 'No user found!' });
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