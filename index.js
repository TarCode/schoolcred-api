const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
const cors = require('cors');
var MongoStore = require('connect-mongodb-session')(session);


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

app.use(cors({
	origin: (origin, cb) => {
		return cb(null, true) // always allow, compare http://stackoverflow.com/questions/29531521/req-headers-origin-is-undefined
	},
	// credentials: true,
	// allowedHeaders: [ 'Content-Type', 'Authorization' ]
}))

app.use(session({
	secret: 'work hard, party harder',
	resave: true,
	saveUninitialized: true,
	cookie: {
		path: '/',
		httpOnly: false,
		maxAge: 24 * 60 * 60 * 1000
	},
	store: new MongoStore({
		url: config.DBHost
	})
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => {
	res.json({ message: "Welcome to the API!" })
})

app.route('/item')
	 .get(item.getItems)
	 .post(item.postItem);

app.route('/item:id')
	 .get(item.getItem)
	 .delete(item.deleteItem)
	 .put(item.updateItem);

app.route('/signin')
	 .post(user.signin);

app.route('/signup')
	.post(user.signup);

app.route('/profile')
	 .get(user.getProfile);

app.route('/logout')
	 .get(user.logout);

app.listen(port, () => {
	console.log("Listening on port ", port);
})

module.exports = app;