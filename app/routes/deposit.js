const mongoose = require('mongoose');
const Deposit = require('../models/deposit');

function getDeposits(req, res) {
	let query = Deposit.find({});

	query.exec((err, deposits) => {
		if (err) return res.send(err);
		return res.json({ success: true, deposits });
	})
}

function postDeposit(req, res) {
	let newDeposit = new Deposit(req.body);
	// TODO: Get current credit, update total and post deposit event

	newDeposit.save((err, deposit) => {
		if (err) return res.send(err);
		return res.json({ success: true, message: "Deposit added!", deposit });
	})
}

module.exports = {
	getDeposits,
	postDeposit
}