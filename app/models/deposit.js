const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const DepositSchema = new Schema({
	userId: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	amount: { type: Number, required: true }
}, {
		versionKey: false
	});

DepositSchema.pre('save', next => {
	now = new Date();
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

module.exports = mongoose.model('deposit', DepositSchema);