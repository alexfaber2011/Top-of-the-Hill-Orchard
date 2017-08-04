const keystone = require('keystone');

function getPage (start = 1, count = 10, category, state) {
	return new Promise((resolve, reject) => {
		const Post = keystone.list('Post');
    const query = Object.assign(
      {},
      state ? { state } : null,
      category ? { category } : null
    );
    Post.paginate({
      page: start,
      perPage: count,
      maxPage: 50,
    })
    .where(query)
    .exec((err, posts) => {
    	err ? reject(err) : resolve(posts);
    });
	});
}

module.exports = { getPage };
