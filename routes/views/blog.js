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

function generatePageNumbers (pageNumbers, currentPage) {
	return _.map(pageNumbers, (pageNumber) => {
		return {
			number: pageNumber,
			isActive: currentPage === pageNumber,
		}
	});
}

exports = module.exports = function (req, res) {
	const pageNumber = extractPageNumber(req) || 1;
	const categoryName = _.get(req, ['params', 'category']);

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		pageNumber,
		postSeparatorText: '',
		posts: [],
		categories: [],
		pageNumbers: [],
		previousPageNumber: pageNumber - 1 || null,
		nextPageNumber: null,
	};

	Promise.all([
		getAllCategories(),
		getPageByCategory(pageNumber, 10, categoryName)
	])
	.then(([categories, paginatedPosts]) => {
		locals.data.pageNumbers = generatePageNumbers(paginatedPosts.pages, pageNumber);
		locals.data.nextPageNumber = pageNumber >= paginatedPosts.totalPages ? null : pageNumber + 1;
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
