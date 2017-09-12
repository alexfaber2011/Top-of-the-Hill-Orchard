var keystone = require('keystone');
const { getPhotos } = require('../../modelHelpers/landingPagePhotoHelper');
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

	// Grab the landing page photos
	getPhotos('published')
		.then(photos => {
			_.merge(locals.securePhotoUrls, _.reduce(photos, (acc, photo) => {
				const url = useExifAngle(_.get(photo, ['image', 'public_id']));
				return _.set(acc, _.get(photo, 'number'), url);
			}, {}));
			view.render('index');
		})
		.catch(err => {
			console.error('unable to get photos: ', err);
			//TODO respond with a proper message
			view.render('index');
		});
};
