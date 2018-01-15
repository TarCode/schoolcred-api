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

		it('Should error on user signup with no fields', done => {

			var userData = {
				email: "",
				username: "",
				password: "",
				passwordConf: "",
			}

			agent
				.post('/signup')
				.send(userData)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				})
		})

		it('Should error on user signup with passwords not matching', done => {

			var userData = {
				email: "test",
				username: "test",
				password: "test",
				passwordConf: "test2",
			}

			agent
				.post('/signup')
				.send(userData)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				})
		})

		it('Should error when signing in with no fields', done => {

			var user = {
				email: "",
				password: ""
			}

			agent
				.post('/signin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				})
		})

		it('Should error when signing in with invalid credentials', done => {

			var user = {
				email: "test",
				password: "abc"
			}

			agent
				.post('/signin')
				.send(user)
				.end((err, res) => {
					res.should.have.status(403);
					done();
				})
		})

		it('Should error when getting user profile without auth', done => {

			var user = {
				email: "test",
				password: "test"
			}

			agent
				.get('/profile?userId=123')
				.end((err, res) => {
					res.should.have.status(403);
					done();
				})
		})

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

		it('Should error when signing up an existing user', done => {

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
					res.should.have.status(403);
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

		it('Should error when getting user profile with incorrect userId', done => {

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
						.get('/profile?userId=123')
						.set('x-access-token', res.body.token)
						.end((err, res) => {
							res.should.have.status(401);
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
