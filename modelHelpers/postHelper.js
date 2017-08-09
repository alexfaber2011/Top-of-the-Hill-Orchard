const keystone = require('keystone');
const _ = require('lodash');
const moment = require('moment');
const { getCategory } = require('./postCategoryHelper');

function enrichPaginationReponse (paginatedPosts) {
	return _.update(paginatedPosts, 'results', (results) => {
		return _.map(results, (post) => {
			return _.set(post, 'humanReadablePublishedDate', moment(post.publishedDate).format('MMMM Do YYYY'));
		});
	});
}

function getPage (start = 1, count = 10, categoryId, state) {
	return new Promise((resolve, reject) => {
		const Post = keystone.list('Post');
    const q = Post.paginate({
      page: start,
      perPage: count,
      maxPage: 50,
    });
		if (state) {
			q.where({ state });
		}
		if (categoryId) {
			q.where('categories').in([categoryId]);
		}
		q.sort('-publishedDate')
		 .populate('author categories')
     .exec((err, paginatedPosts) => {
    	 err ? reject(err) : resolve(enrichPaginationReponse(paginatedPosts));
      });
	});
}

function getPageByCategory (start = 1, count = 10, categoryName, state) {
	return !categoryName
		? getPage(state, count, null, state)
		: getCategory({ name: categoryName })
				.then((category) => {
					return getPage(start, count, category._id, state);
				});
}

module.exports = { getPage, enrichPaginationReponse, getPageByCategory };
