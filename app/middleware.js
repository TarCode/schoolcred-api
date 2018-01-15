const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('config');
const morgan = require('morgan');

function corsMiddleware() {
	return cors({
		origin: (origin, cb) => {
			return cb(null, true) // always allow, compare http://stackoverflow.com/questions/29531521/req-headers-origin-is-undefined
		},
		// credentials: true,
		// allowedHeaders: [ 'Content-Type', 'Authorization' ]
	})
}

function tokenMiddleware(req, res, next) {
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
}

module.exports = {
	corsMiddleware,
	tokenMiddleware
}