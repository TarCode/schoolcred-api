const mongoose = require('mongoose');
const Deposit = require('../models/deposit');
const Credit = require('../models/credit');

function getDeposits(req, res) {
	let query = Deposit.find({ userId: req.params.userId });

	query.exec((err, deposits) => {
		if (err) return res.send(err);
		return res.json({ success: true, deposits });
	})
}

function postDeposit(req, res) {
	let newDeposit = new Deposit({
		amount: req.body.amount,
		userId: req.params.userId
	});

	newDeposit.save((err, deposit) => {
		if (err) return res.send(err);

		let creditQuery = Credit.findOne({ userId: req.params.userId });

		creditQuery.exec((err, credit) => {
			if (err) return res.send(err);

			if (!credit) {
				let newCredit = new Credit({
					userId: req.params.userId,
					total: 0
				});

				newCredit.save((err, credit) => {
					if (err) return res.send(err);

					credit.total += deposit.amount;
					credit.save((err, updatedCredit) => {
						if (err) return res.send(err);
						return res.json({ success: true, message: "Credit updated!", credit: updatedCredit });
					})

				})
			} else {

				Credit.findById({ _id: credit.id }, (err, credit) => {
					if (err) return res.send(err);
					credit.total += deposit.amount;
					credit.save((err, updatedCredit) => {
						if (err) return res.send(err);
						return res.json({ success: true, message: "Credit updated!", credit: updatedCredit });
					})
				})
			}
		})
	})
}

module.exports = {
	getDeposits,
	postDeposit
}