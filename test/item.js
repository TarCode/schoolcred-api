process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Item = require('../app/models/item');
const User = require('../app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server)


describe('Items', () => {
	before(done => {
		Item.remove({}, err => {
			var userData = {
				email: "test",
				username: "test",
				password: "test",
				passwordConf: "test",
			}

			agent
				.post('/signup')
				.send(userData)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('token');
					done();
				})
		})
		
	})

	it('Should throw error when getting items without auth', done => {
		agent
			.get('/item')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should throw error when getting items with incorrect token', done => {
		agent
			.get('/item')
			.set('x-access-token', "123123123123123")
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should throw error when adding an item without auth', done => {
		var item = {
			name: "test",
			createdBy: "test"
		}

		agent
			.post('/item')
			.send(item)
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should throw error when getting an item by id without auth', done => {

		agent
			.get('/item/123')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should throw error when updating an item without auth', done => {
		agent
			.put('/item/123')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should throw error when deleting an item without auth', done => {
		agent
			.delete('/item/123')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should get all the items', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('token');

				agent
					.get('/item')
					.set('x-access-token', res.body.token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.items.should.be.a('array');
						res.body.items.length.should.be.eql(0);
						done();
					})
			})
	})

	it('Should add an item', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('token');

				var item = {
					name: "test",
					createdBy: "test"
				}

				agent
					.post('/item')
					.set('x-access-token', res.body.token)
					.send(item)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					})
			})
	})

	it('Should get an item by ID', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, signinRes) => {
				signinRes.should.have.status(200);
				signinRes.body.should.have.property('token');

				var item = {
					name: "test",
					createdBy: "test"
				}

				agent
					.post('/item')
					.set('x-access-token', signinRes.body.token)
					.send(item)
					.end((err, res) => {
						const itemId = JSON.parse(res.text).item._id;
						res.should.have.status(200);

						var itemToUpdate = {
							name: "test3r"
						}

						agent
							.get('/item/' + itemId)
							.set('x-access-token', signinRes.body.token)
							.end((err, res) => {
								res.should.have.status(200);
								done();
							})

					})

			})
	})

	it('Should update an item', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, signinRes) => {
				signinRes.should.have.status(200);
				signinRes.body.should.have.property('token');

				var item = {
					name: "test",
					createdBy: "test"
				}

				agent
					.post('/item')
					.set('x-access-token', signinRes.body.token)
					.send(item)
					.end((err, res) => {
						const itemId = JSON.parse(res.text).item._id;
						res.should.have.status(200);

						var itemToUpdate = {
							name: "test3r"
						}

						agent
							.put('/item/' + itemId)
							.set('x-access-token', signinRes.body.token)
							.send(itemToUpdate)
							.end((err, res) => {
								res.should.have.status(200);
								done();
							})

					})

			})
	})

	it('Should delete an item', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, signinRes) => {
				signinRes.should.have.status(200);
				signinRes.body.should.have.property('token');

				var item = {
					name: "test",
					createdBy: "test"
				}

				agent
					.post('/item')
					.set('x-access-token', signinRes.body.token)
					.send(item)
					.end((err, res) => {
						const itemId = JSON.parse(res.text).item._id;
						res.should.have.status(200);

						var itemToUpdate = {
							name: "test3r"
						}

						agent
							.delete('/item/' + itemId)
							.set('x-access-token', signinRes.body.token)
							.end((err, res) => {
								res.should.have.status(200);
								done();
							})

					})

			})
	})


	after(done => {
		Item.remove({}, err => {
			User.remove({}, err => {
				done()
			})
		})
	})

})
