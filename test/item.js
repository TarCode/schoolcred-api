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

	describe('/GET items', () => {
		it('Should GET all the items', done => {
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
							res.body.should.be.a('array');
							res.body.length.should.be.eql(0);
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

	})


	after(done => {
		Item.remove({}, err => {
			User.remove({}, err => {
				done()
			})
		})
	})

})
