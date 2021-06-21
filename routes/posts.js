const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const httpHandler = require('../services/httpHandler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/posts', async (req, res) => {
	await httpHandler.fetchAllPosts();
});

module.exports = app;
