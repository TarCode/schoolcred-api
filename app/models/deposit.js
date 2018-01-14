const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const DepositSchema = new Schema({
	userId: { type: String, required: true },
	updatedAt: { type: Date, default: Date.now },
	total: { type: Number, required: true }
}, {
		versionKey: false
	});

DepositSchema.pre('save', next => {
	now = new Date();
	if (!this.updatedAt) {
		this.updatedAt = now;
	}
	next();
});

module.exports = mongoose.model('deposit', DepositSchema);