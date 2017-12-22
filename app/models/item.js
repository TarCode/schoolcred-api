const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: String, required: true }
}, {
	versionKey: false
});

ItemSchema.pre('save', next => {
	now = new Date();
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

module.exports = mongoose.model('item', ItemSchema);