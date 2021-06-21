const serviceCatalogue = {
	posts: 'https://jsonplaceholder.typicode.com/posts',
	users: 'https://jsonplaceholder.typicode.com/users',
	comments: 'https://jsonplaceholder.typicode.com/posts/:postId/comments',
};

const serviceOptions = {
	hostname: serviceCatalogue.posts,
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
	},
};
module.exports = { serviceCatalogue, serviceOptions };
