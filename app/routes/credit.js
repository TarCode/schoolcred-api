const mongoose = require('mongoose');
const Credit = require('../models/credit');

function getCredit(req, res) {
	let query = Credit.findOne({ userId: req.params.userId });

	query.exec((err, credit) => {
		if (err) return res.send(err);

		if (!credit) {
			let newCredit = new Credit({
				userId: req.params.userId,
				total: 0
			});

			newCredit.save((err, credit) => {
				if (err) return res.send(err);
				return res.json({ success: true, message: "Credit account created!", credit });
			})
		} else {
			return res.json({ success: true, credit });
		}
	})
}


module.exports = {
	getCredit
}