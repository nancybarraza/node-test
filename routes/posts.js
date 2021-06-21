const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const postsDataManager = require('../services/postsDataManager');
const usersDataManager = require('../services/usersDataManager');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * @method /posts
 * Enables the route to get all the posts information.
 * It also requsts the users information to amend their data on each post that matches with userId.
 * @return {object[] || object}
 */
app.get('/posts', async (req, res) => {
	try {
		const users = (await usersDataManager.getAllUsers()) || [];
		let { start, size } = req.query || {};
		if (start < 0) {
			start = 1;
		}
		const response = (await postsDataManager.getPosts({ start, size }, users)) || [];
		res.json(response);
	} catch (err) {
		res.json({
			code: 500,
			success: false,
			err,
		});
	}
});

module.exports = { app };
