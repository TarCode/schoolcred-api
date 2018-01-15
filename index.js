const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');

const item = require('./app/routes/item');
const user = require('./app/routes/user');
const credit = require('./app/routes/credit');
const deposit = require('./app/routes/deposit');

const middleware = require('./app/middleware');


//db connection      
mongoose.connect(config.DBHost, {
	useMongoClient: true
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

config.util.getEnv('NODE_ENV') !== 'test' && app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(middleware.corsMiddleware());

app.route('/signin')
	.post(user.signin);

app.route('/signup')
	.post(user.signup);


app.use(middleware.tokenMiddleware);

app.route('/profile')
	.get(user.getProfile);

app.route('/item')
	 .get(item.getItems)
	 .post(item.postItem);

app.route('/item/:id')
	 .get(item.getItem)
	 .delete(item.deleteItem)
	 .put(item.updateItem);

app.route('/deposit/:userId')
	.get(deposit.getDeposits)
	.post(deposit.postDeposit);

app.route('/credit/:userId')
	.get(credit.getCredit)


app.listen(config.port, () => {
	console.log("Listening on port ", config.port);
})

module.exports = app;