process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server)


describe('User', () => {

	before(done => {
		User.remove({}, err => {
			done()
		})
	})

	describe('user', () => {
		it('Should signup a user', done => {

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

		it('Should sign a user in', done => {

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
					done();
				})
		})

		it('Should get user profile', done => {

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
						.get('/profile?userId=' + res.body.userId)
						.set('x-access-token', res.body.token)
						.end((err, res) => {
							res.should.have.status(200);
							done();
						})

				})

			
		})
	})



	after(done => {
		User.remove({}, err => {
			done()
		})
	})

})
