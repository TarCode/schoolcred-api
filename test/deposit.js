process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Deposit = require('../app/models/deposit');
const Credit = require('../app/models/credit');
const User = require('../app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server)


describe('Deposit', () => {
	before(done => {
		Credit.remove({}, err => {
			User.remove({}, err => {
				Deposit.remove({}, err => {
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
		})
	})

	it('Should throw error when getting deposits without auth', done => {
		agent
			.get('/deposit/123')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})


	it('Should throw error when adding a deposit without auth', done => {
		var depositData = {
			amount: 100
		}

		agent
			.post('/deposit/123')
			.send(depositData)
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})

	it('Should get all deposits', done => {
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
					.get('/deposit/' + res.body.userId)
					.set('x-access-token', res.body.token)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.deposits.should.be.a('array');
						res.body.deposits.length.should.be.eql(0);
						done();
					})
			})
	})

	it('Should add a deposit if credit account does not exist', done => {
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

				var depositData = {
					amount: 123
				}

				agent
					.post('/deposit/' + res.body.userId)
					.set('x-access-token', res.body.token)
					.send(depositData)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.credit.total.should.equal(123)
						done();
					})
			})
	})

	it('Should add a deposit if credit account exists', done => {
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

				var depositData = {
					amount: 234
				}

				agent
					.post('/deposit/' + res.body.userId)
					.set('x-access-token', res.body.token)
					.send(depositData)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.credit.total.should.equal(357)
						done();
					})
			})
	})



	after(done => {
		Credit.remove({}, err => {
			Deposit.remove({}, err => {
				User.remove({}, err => {
					done()
				})
			})
		})
	})
})
