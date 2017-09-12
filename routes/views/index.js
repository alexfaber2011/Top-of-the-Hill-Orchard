var keystone = require('keystone');
const { getPhotos } = require('../../modelHelpers/landingPagePhotoHelper');
const { getRecentAppleReport } = require('../../modelHelpers/postHelper');
const _ = require('lodash');
const { useExifAngle } = require('../../utilities/imageService');

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
		getRecentAppleReport('published'),
	])
	.then(([photos, appleReportPost]) => {
		//Merge the photos into locals
		_.merge(locals.securePhotoUrls, _.reduce(photos, (acc, photo) => {
			const url = useExifAngle(_.get(photo, ['image', 'public_id']));
			return _.set(acc, _.get(photo, 'number'), url);
		}, {}));

		//set the apple report post accordingly
		locals.appleReportPost = appleReportPost
		view.render('index');
	})
	.catch(err => {
		console.error('unable to get photos or recent apple report: ', err);
		//TODO respond with a proper message
		view.render('index');
	});
};
