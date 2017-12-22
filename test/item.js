process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Item = require('../app/models/item');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Items', () => {
	beforeEach(done => {
		Item.remove({}, err => {
			done()
		})
	})

	describe('/GET items', () => {
		it('Should GET all the items', done => {
			chai.request(server)
					.get('/item')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);
						done();
					})
		})
	})
})
