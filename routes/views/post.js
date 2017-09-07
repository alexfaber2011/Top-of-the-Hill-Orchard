var keystone = require('keystone');
const { getPost } = require('../../modelHelpers/postHelper');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.data = {
		post: null,
	};

	getPost({slug: req.params.slug})
		.then(post => {
			locals.data.post = post;
			view.render('post');
		})
		.catch(err => {
			//TODO respond with a friendly error page
		})
};
