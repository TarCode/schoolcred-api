const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const port = 8080;

const item = require('./app/routes/item');
const user = require('./app/routes/user');
let config = require('config');

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



app.get('/', (req, res) => {
	res.json({ message: "Welcome to the API!" })
})

app.route('/signin')
	.post(user.signin);

app.route('/signup')
	.post(user.signup);

app.route('/profile')
	.get(user.getProfile);

app.route('/logout')
	.get(user.logout);


app.use(function (req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}
});

app.route('/item')
	 .get(item.getItems)
	 .post(item.postItem);

app.route('/item/:id')
	 .get(item.getItem)
	 .delete(item.deleteItem)
	 .put(item.updateItem);

app.listen(port, () => {
	console.log("Listening on port ", port);
})

module.exports = app;