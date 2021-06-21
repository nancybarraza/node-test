/**
 * @property {Object} serviceCatalogue Stores the endpoints hostnames for http requests.
 */
const serviceCatalogue = {
	posts: process.env.POSTS_HOSTNAME || 'https://jsonplaceholder.typicode.com/posts',
	users: process.env.USERS_HOSTNAME || 'https://jsonplaceholder.typicode.com/users',
	comments: process.env.COMMENTS_HOSTNAME || 'https://jsonplaceholder.typicode.com/posts/:postId/comments',
};
module.exports = { serviceCatalogue };
