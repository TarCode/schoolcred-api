const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('config');
const cors = require('cors');

const port = 8080;

const item = require('./app/routes/item');
const user = require('./app/routes/user');
const credit = require('./app/routes/credit');
const deposit = require('./app/routes/deposit');

let options = {
	useMongoClient: true
};

//db connection      
mongoose.connect(config.DBHost, options);

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(cors({
	origin: (origin, cb) => {
		return cb(null, true) // always allow, compare http://stackoverflow.com/questions/29531521/req-headers-origin-is-undefined
	},
	// credentials: true,
	// allowedHeaders: [ 'Content-Type', 'Authorization' ]
}))

app.route('/signin')
	.post(user.signin);

app.route('/signup')
	.post(user.signup);


app.use((req, res, next) => {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

app.route('/profile')
	.get(user.getProfile);

app.route('/item')
	 .get(item.getItems)
	 .post(item.postItem);

app.route('/item/:id')
	 .get(item.getItem)
	 .delete(item.deleteItem)
	 .put(item.updateItem);

app.route('/deposit')
	.get(deposit.getDeposits)
	.post(deposit.postDeposit);

app.listen(port, () => {
	console.log("Listening on port ", port);
})

module.exports = app;