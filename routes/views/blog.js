var keystone = require('keystone');
const _ = require('lodash');
const { getAllCategories } = require('../../modelHelpers/postCategoryHelper');
const { getPageByCategory } = require('../../modelHelpers/postHelper');

/**
 * extractPageNumber - grabs the page number from query params
 *
 * @param  {object} req the express request object
 * @return {number}     the page number if it exists, null otherwise
 */
function extractPageNumber (req) {
	return _.chain(req).get(['query', 'page']).toNumber().value();
}

exports = module.exports = function (req, res) {
	const pageNumber = extractPageNumber(req);
	const categoryName = _.get(req, ['params', 'category']);

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		postSeparatorText: '',
		posts: [],
		categories: [],
	};

	Promise.all([
		getAllCategories(),
		getPageByCategory(pageNumber, 10, categoryName)
	])
	.then(([categories, paginatedPosts]) => {
		console.log('paginatedPosts: ', paginatedPosts);
		locals.data.categories = categories;
		locals.data.posts = paginatedPosts.results;
		locals.data.postSeparatorText = `${paginatedPosts.total} blog ${paginatedPosts.total === 1 ? 'entry' : 'entries'}`;
		// Render the view
		view.render('blog');
	})
	.catch(err => {
		//TODO respond with a friendly page
		console.error('err: ', err);
	})
};
