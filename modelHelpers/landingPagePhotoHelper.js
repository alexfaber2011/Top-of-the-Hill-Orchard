const keystone = require('keystone');

const getPhotos = (state) => {
	return new Promise((resolve, reject) => {
		keystone.list('LandingPagePhoto').model.find({ state })
			.exec((err, photos) => {
				err ? reject(err) : resolve(photos);
			});
	});
};

module.exports = { getPhotos };
