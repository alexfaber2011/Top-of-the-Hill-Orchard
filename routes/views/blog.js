var keystone = require('keystone');
var async = require('async');
const _ = require('lodash');

const postCategoryHelper = require('../../modelHelpers/postCategoryHelper');
const postHelper = require('../../modelHelpers/postHelper');


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
	const category = _.get(req, ['params', 'category']);

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
		postCategoryHelper.getAllCategories(),
		postHelper.getPage(pageNumber, 10, category)
	])
	.then(([categories, paginatedPosts]) => {
		console.log('categories: ', categories);
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



	// Load the current category filter
	// view.on('init', function (next) {
	//
	// 	if (req.params.category) {
	// 		keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
	// 			locals.data.category = result;
	// 			next(err);
	// 		});
	// 	} else {
	// 		next();
	// 	}
	// });

	// Load the posts
	// view.on('init', function (next) {
	//
	// 	var q = keystone.list('Post').paginate({
	// 		page: req.query.page || 1,
	// 		perPage: 10,
	// 		maxPages: 10,
	// 		filters: {
	// 			state: 'published',
	// 		},
	// 	})
	// 		.sort('-publishedDate')
	// 		.populate('author categories');
	//
	// 	if (locals.data.category) {
	// 		q.where('categories').in([locals.data.category]);
	// 	}
	//
	// 	q.exec(function (err, results) {
	// 		locals.data.posts = results;
	// 		next(err);
	// 	});
	// });

};
