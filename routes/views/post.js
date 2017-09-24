var keystone = require('keystone');
const _ = require('lodash');
const { getPost } = require('../../modelHelpers/postHelper');
const cloudinary = require('cloudinary');

cloudinary.config({ cloud_name: 'anzaborrego' });

function transformImage (post) {
	const publicId = _.get(post, ['image', 'public_id']);
	return publicId
		? _.set(post, ['image', 'secure_url'], cloudinary.url(publicId, { width: 2560, angle: 'exif', quality: 'auto:good', secure: true }))
		: post;
}

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.data = {
		post: null,
	};

	getPost({ slug: req.params.slug })
		.then(post => {
			locals.data.post = transformImage(post);
			view.render('post');
		})
		.catch(err => {
			console.error('[post.js getPost()] err: ', err);
			view.render('errors/500');
		});
};
