const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = 8080;

const item = require('./app/routes/item');
let config = require('config');

let options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

//db connection      
mongoose.connect(config.DBHost, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => {
	res.json({ message: "WElcome to the API!" })
})

app.route('/item')
	 .get(item.getItems)
	 .post(item.postItem);

app.route('/item:id')
	 .get(item.getItem)
	 .delete(item.deleteItem)
	 .put(item.updateItem);

app.listen(port, () => {
	console.log("Listening on port ", port);
})

module.exports = app;