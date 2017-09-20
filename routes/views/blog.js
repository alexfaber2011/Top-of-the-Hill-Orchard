var keystone = require('keystone');
const _ = require('lodash');
const { getAllCategories } = require('../../modelHelpers/postCategoryHelper');
const { getPageByCategory } = require('../../modelHelpers/postHelper');
const cloudinary = require('cloudinary');

cloudinary.config({ cloud_name: 'anzaborrego' });

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


/**
 * transformImages - given a posts array, this function will transform the cloudinary
 * url to request image sizes that are small and of good quality (but no more) to
 * enable faster load times
 *
 * @param  {Array<Posts>} posts an array of blog posts (objects)
 * @return {Array<Posts>}       an array of blog posts (objects)
 */
function transformImages (posts) {
	return _.map(posts, (post) => {
		const publicId = _.get(post, ['image', 'public_id']);
		return publicId
			? _.set(post, ['image', 'secure_url'], cloudinary.url(publicId, { width: 200, angle: 'exif', quality: 'auto:good', secure: true }))
			: post;
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
		allCategoryActive: true,
	};

	Promise.all([
		getAllCategories(),
		getPageByCategory(pageNumber, 10, categoryName)
	])
	.then(([categories, paginatedPosts]) => {
		locals.data.pageNumbers = generatePageNumbers(paginatedPosts.pages, pageNumber);
		locals.data.nextPageNumber = pageNumber >= paginatedPosts.totalPages ? null : pageNumber + 1;
		locals.data.allCategoryActive = _.isNil(_.find(categories, ['name', categoryName]));
		locals.data.categories = _.map(categories, category => {
			return _.set(category, 'active', category.name === categoryName);
		});
		locals.data.posts = transformImages(paginatedPosts.results);
		locals.data.postSeparatorText = `${paginatedPosts.total} blog ${paginatedPosts.total === 1 ? 'entry' : 'entries'}`;
		// Render the view
		view.render('blog');
	})
	.catch(err => {
		//TODO respond with a friendly page
		console.error('err: ', err);
	})
};
