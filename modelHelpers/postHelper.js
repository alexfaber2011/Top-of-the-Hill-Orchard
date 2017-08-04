const keystone = require('keystone');

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
     .exec((err, posts) => {
    	 err ? reject(err) : resolve(posts);
      });
	});
}

module.exports = { getPage };
