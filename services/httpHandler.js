const http = require('http');
const { post } = require('../routes/posts');
const { serviceCatalogue, serviceOptions } = require('../serviceCatalogue');

// Service to fetch the data from server.
// Should contain methods to fetch the posts, the users, and the comments.
// We need a method to parse the data and transform it into the next format.
/** 
 *  const post = { 
 *      id: number,
 *      title: string,
 *      body: string,
 *      user: {
 *          "name": "string",
            "username": "string",
            "email": "string",
            "address": {
                "street": "string",
                "suite": "string",
                "city": "string",
                "zipcode": "string",
                "geo": {
                    "lat": "-37.3159",
                    "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
       }, 
        comments: [
            {
                "id": 1,
                "name": "id labore ex et quam laborum",
                "email": "Eliseo@gardner.biz",
                "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
            },
        ]  
 *  };
    response should be:
    posts: [ {post} ]
 */

/**
 * Description
 * @class name
 * @singleton
 */

const LOG_TAG = '\x1b[35m' + '[httpHandler]' + '\x1b[39;49m ';

const httpHandler = (() => {
	// +-------------------
	// | Private members.
	// +-------------------

	const users = [];

	const comments = [];

	const fetchAllUsers = () => {
		Object.assign(serviceOptions, {
			hostname: serviceCatalogue.users,
		});

		return http
			.request(serviceOptions, (res) => {
				res.on('error', (err) => {
					return err;
				});
				res.on('data', (data) => {
					users.push(data);
				});
			})
			.toPromise();
	};

	const fetchAllCommentsByPostId = (postId = 0) => {
		if (!postId) {
			return [];
		}
		const hostname = serviceCatalogue.comments.toString().replace(':postId', postId);
		Object.assign(serviceOptions, {
			hostname,
		});

		return http.request(serviceOptions, (res) => {
			res.on('error', (err) => {
				return err;
			});
			res.on('data', (data) => {
				users.push(data);
			});
		});
	};

	const filterAuthorById = (userId = 0) => {
		const user = users.filter((user) => user.id === userId);
		if (!user) {
			return {};
		}
		return user;
	};

	const filterCommentsById = (postId = 0) => {
		const filteredComments = comments.filter((comment) => comment.postId === postId);
		if (!filteredComments) {
			return [];
		}
		return filteredComments;
	};

	// +-------------------
	// | Public members.
	// +-------------------

	const fetchAllPosts = async () => {
		const posts = [];

		try {
			await fetchAllUsers();
			await http.request(serviceOptions, (res) => {
				res.on('error', (err) => {
					return err;
				});
				res.on('data', (data) => {
					posts.push(data);
				});
			});

			if (posts && posts.length) {
				return posts.map((post) => {
					const user = filterAuthorById(post.userId);
					const comments = filterCommentsById(post.id);
					return {
						...post,
						user,
						comments,
					};
				});
			}
		} catch (err) {
			res.status(500);
		}
	};

	return { fetchAllPosts };
})();

module.exports = httpHandler;
