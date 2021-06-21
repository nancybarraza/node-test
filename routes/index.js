const express = require('express');
const app = express();

const { app: posts } = require('./posts');

// registers the posts endpoint
app.use(posts);

// process all other requests as 404 to avoid unexpected calls
app.use('*', (req, res) => {
	res.json({
		code: 404,
		success: false,
		error: {
			message: 'Not found',
		},
	});
});

module.exports = { app };
