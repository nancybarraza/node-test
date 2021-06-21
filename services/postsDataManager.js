const fetch = require('node-fetch');
const { serviceCatalogue } = require('../serviceCatalogue');
const usersDataManager = require('./usersDataManager');

/**
 * Service to fetch the data from server.
 * Contains methods to fetch the posts, the users, and the comments.
 * Also it parses the data and transform it into the next format:
 *  const post = {
 *      id: number,
 *      title: string,
 *      body: string,
 *      user: {
 * 			"id": number,
 *          "name": string,
 *           "username": string,
 *           "email": string,
 *           "address": {
 *               "street": string,
 *               "suite": string,
 *               "city": string,
 *               "zipcode": string,
 *               "geo": {
 *                   "lat": string,
 *                   "lng": "string
 *               }
 *           },
 *           "phone": string,
 *           "website": string,
 *           "company": {
 *               "name": string,
 *               "catchPhrase": string,
 *               "bs": string,
 *           }
 *      },
 *       comments: [
 *           {
 *               "id": number,
 *               "name": string,
 *               "email": string,
 *               "body": string,
 *           },
 *       ]
 *  };
 *   response should be:
 *   posts: [ {post} ]
 * @class postsDataManager
 * @singleton
 */

const postsDataManager = (() => {
	// +-------------------
	// | Private members.
	// +-------------------

	let users = [];

	/**
	 * @method fetchPosts
	 * Fetchs all the posts available in the endpoint paginating it based on size and start params.
	 * We are filtering the posts since this stage of the process to avoid multiple calls to
	 * the comments endpoint when we format the data.
	 * @param  {Object} params Stores the values to paginate the data
	 * @return {array}
	 */
	const fetchPosts = async (params) => {
		const { start = 1, size = 10 } = params;
		const results = await fetch(serviceCatalogue.posts).then((r) => r.json());
		const offset = (start - 1) * size;
		return results.slice(offset, start * size);
	};

	/**
	 * @method fetchAllCommentsByPostId
	 * Retrieves the comments based on postId, we are formatting the hostname to
	 * replace the postId with the variable.
	 * @param postId = 0 Default assign the parameter to 0 to prevent unknown / unexpected errors on the request.
	 * @return {Promise}
	 */
	const fetchAllCommentsByPostId = async (postId = 0) => {
		const hostname = serviceCatalogue.comments.toString().replace(':postId', postId);
		return await fetch(hostname).then((r) => r.json());
	};

	/**
	 * @method formatData
	 * Process and format the post object to amend user and comments data on each result.
	 * @return {Array}
	 */
	const formatData = (posts = []) => {
		if (!posts.length) {
			return [];
		}
		return posts.map(async (post = {}) => {
			if ((post && !post.id) || (post && !post.userId)) {
				return post;
			}
			const user = usersDataManager.filterByUserId(users, post.userId) || {};
			const comments = (await fetchAllCommentsByPostId(post.id)) || [];
			return {
				...post,
				user,
				comments,
			};
		});
	};

	// +-------------------
	// | Public members.
	// +-------------------

	const getPosts = async (params, usersData) => {
		try {
			users = usersData;
			const posts = (await fetchPosts(params)) || [];
			const results = formatData(posts);
			if (!results.length) {
				return {
					code: 404,
					error: 'Posts not found',
				};
			}
			return Promise.all(results);
		} catch (err) {
			throw new Error(err);
		}
	};

	return { getPosts };
})();

module.exports = postsDataManager;
