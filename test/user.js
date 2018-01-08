process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../app/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {

	before(done => {
		User.remove({}, err => {
			done()
		})
	})

	describe('/POST user', () => {
		it('Should signup a user', done => {

			var userData = {
				email: "test",
				username: "test",
				password: "test",
				passwordConf: "test",
			}

			chai.request(server)
					.post('/signup')
					.send(userData)
					.end((err, res) => {
						res.should.have.status(200);
						res.text.should.be.a('string');
						res.text.should.equal('Signed up!');
						done();
					})
		})
	})

	describe('/GET logout', () => {
		it('Should log a user out', done => {
			chai.request(server)
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
