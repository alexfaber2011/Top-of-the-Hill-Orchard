var keystone = require('keystone');
const { getPhotos } = require('../../modelHelpers/landingPagePhotoHelper');
const { getRecentAppleReport } = require('../../modelHelpers/postHelper');
const _ = require('lodash');
const cloudinary = require('cloudinary');

cloudinary.config({ cloud_name: 'anzaborrego' });

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.securePhotoUrls = {
		1: null,
		2: null,
		3: null,
		4: null,
	};
	locals.appleReportPost = null;

	// Grab the landing page photos and check to see if there's a recently published apple report
	Promise.all([
		getPhotos('published'),
		getRecentAppleReport(_.get(req, ['user', 'isAdmin']) ? 'draft' : 'published'),
	])
	.then(([photos, appleReportPost]) => {
		// Merge the photos into locals
		_.merge(locals.securePhotoUrls, _.reduce(photos, (acc, photo) => {
			const url = cloudinary.url(_.get(photo, ['image', 'public_id']), { width: 265, angle: 'exif', quality: 'auto:good', secure: true });
			return _.set(acc, _.get(photo, 'number'), url);
		}, {}));

		// set the apple report post accordingly
		locals.appleReportPost = appleReportPost;
		view.render('index');
	})
	.catch(err => {
		console.error('unable to get photos or recent apple report: ', err);
		view.render('index');
	});
};
