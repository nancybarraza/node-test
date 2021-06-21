const fetch = require('node-fetch');
const { serviceCatalogue } = require('../serviceCatalogue');

/**
 * Processess all the requests to get and find users.
 * @class usersDataManager
 * @singleton
 */

const usersDataManager = (() => {
	// +-------------------
	// | Private members.
	// +-------------------

	/**
	 * @method fetchAllusers
	 * @private
	 * Retrieves all the users information to setup the catalogue to amend the data in the posts.
	 * @return {Promise}
	 */
	const fetchAllUsers = async () => {
		return await fetch(serviceCatalogue.users).then((r) => r.json());
	};

	// +-------------------
	// | Public members.
	// +-------------------

	/**
	 * @method filterByUserId
	 * Obtains the author/user data from userId.
	 * Filtering from the users catalogue that we created on the initial call.
	 * @return {void}
	 */
	const filterByUserId = (users, userId = 0) => {
		return (
			users.filter((user) => {
				return user.id === userId;
			})[0] || {}
		);
	};

	/**
	 * @method getAllUsers
	 * Fetch all users data from the database.
	 * @return {Array}
	 */
	const getAllUsers = async () => {
		const response = (await fetchAllUsers()) || [];
		if (!response.length) {
			return {
				code: 404,
				error: 'Users not found',
			};
		}
		return response;
	};

	return {
		getAllUsers,
		filterByUserId,
	};
})();

module.exports = usersDataManager;
