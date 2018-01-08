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
					.withCredentials()
					.send(userData)
					.end((err, res) => {
						res.should.have.status(200);
						res.text.should.be.a('string');
						res.text.should.equal('Signed up!');
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
				.withCredentials()
				.send(user)
				.end((err, res) => {
					console.log("ERROR:",err);
					res.should.have.status(200);
					res.text.should.be.a('string');
					res.text.should.equal('Signed in!');
					done();
				})
		})

		it('Should get user profile', done => {
			agent
				.get('/profile')
				.end((err, res) => {
					res.should.have.status(200);
					done();
				})
		})

		it('Should log a user out', done => {
			agent
				.get('/logout')
				.end((err, res) => {
					res.should.have.status(200);
					res.text.should.be.a('string');
					res.text.should.equal('Logged Out!');
					done();
				})
		})
	})



	after(done => {
		User.remove({}, err => {
			done()
		})
	})

})
