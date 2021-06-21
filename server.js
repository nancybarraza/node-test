const PORT = process.env.PORT || 3000;
const express = require('express');
const path = require('path');

const { app: posts } = require('./routes/posts');

const app = express();

const startServer = async () => {
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		next();
	});

	app.use(express.json);
	app.use(posts);

	app.listen(PORT, () => {
		console.log(`Listening on port: ${PORT}`);
	});
};

startServer();
