const mongoose = require('mongoose');
const Item = require('../models/item');

function getItems(req, res) {
	let query = Item.find({});

	query.exec((err, items) => {
		if (err) res.send(err);
		res.json(items);
	})
}

function postItem(req, res) {
	let newItem = new Item(req.body);

	newItem.save((err, item) => {
		if (err) res.send(err);
		res.json({ message: "Item added!", item });
	})
}

function getItem(req, res) {
	Item.findById(req.params.id, (err, item) => {
		if (err) res.send(err);
		res.json(item);
	})
}

function deleteItem(req, res) {
	Item.remove({ _id: req.params.id }, (err, result) => {
		res.json({ message: "Item deleted!", result })
	})
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