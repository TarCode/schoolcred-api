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


describe('Credit', () => {
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

	it('Should throw error when getting credit balance without auth', done => {
		agent
			.get('/credit/123')
			.end((err, res) => {
				res.should.have.status(403);
				done();
			})
	})


	it('Should get credit balance', done => {
		var user = {
			email: "test",
			password: "test"
		}

		agent
			.post('/signin')
			.send(user)
			.end((err, userRes) => {
				userRes.should.have.status(200);
				userRes.body.should.have.property('token');

				var depositData = {
					amount: 123,
					userId: userRes.body.userId
				}

				agent
					.post('/deposit')
					.set('x-access-token', userRes.body.token)
					.send(depositData)
					.end((err, res) => {
						res.should.have.status(200);
						agent
							.get('/credit/' + userRes.body.userId)
							.set('x-access-token', userRes.body.token)
							.end((err, res) => {
								res.should.have.status(200);
								done();
							})
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
