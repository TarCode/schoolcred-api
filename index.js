const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

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

app.use(session({
	secret: 'work hard, party harder',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
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